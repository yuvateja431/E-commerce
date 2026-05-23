import { PrismaClient, ProductStatus } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

// Helper to generate slug from name
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Helper to calculate discount percentage
const calculateDiscountPercentage = (price: number, discountPrice: number | null) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export class ProductService {
  static async createProduct(data: any) {
    const { stock, variants, name, price, discountPrice, slug, ...productData } = data;
    
    const finalSlug = slug || generateSlug(name);
    const finalDiscountPct = calculateDiscountPercentage(price, discountPrice);

    const product = await prisma.product.create({
      data: {
        name,
        price,
        discountPrice,
        discountPercentage: finalDiscountPct,
        slug: finalSlug,
        ...productData,
        inventory: {
          create: { stock: stock || 0 }
        },
        variants: variants && variants.length > 0 ? {
          create: variants
        } : undefined
      },
      include: { inventory: true, category: true, variants: true }
    });
    return product;
  }

  static async getAllProducts(query: any) {
    const {
      page = 1, limit = 12, search, category, brand,
      minPrice, maxPrice, rating, sortBy, sortOrder,
      status, excludeDraft, inStock, onSale
    } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (excludeDraft === 'true') where.status = { not: 'DRAFT' };
    if (status) where.status = status;

    // Search across name, description, brand, tags, and category name
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      const cats = category.split(',');
      where.categoryId = cats.length > 1 ? { in: cats } : cats[0];
    }
    
    if (brand) {
      const brands = brand.split(',');
      where.brand = brands.length > 1 ? { in: brands } : { contains: brands[0], mode: 'insensitive' };
    }
    if (rating) where.averageRating = { gte: Number(rating) };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      where.inventory = { stock: { gt: 0 } };
      where.status = 'IN_STOCK';
    }

    if (onSale === 'true') {
      where.discountPrice = { not: null };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy) {
      if (sortBy === 'price') orderBy = { price: sortOrder || 'asc' };
      else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
      else if (sortBy === 'rating') orderBy = { averageRating: 'desc' };
      else if (sortBy === 'popularity') orderBy = { reviewCount: 'desc' };
      else if (sortBy === 'newest' || sortBy === 'createdAt') orderBy = { createdAt: 'desc' };
      else if (sortBy === 'discount') orderBy = { discountPercentage: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          category: true,
          inventory: true,
          variants: true,
          _count: { select: { reviews: true } }
        }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async getSuggestions(search: string) {
    if (!search || search.trim().length < 2) return [];
    const products = await prisma.product.findMany({
      where: {
        status: { not: 'DRAFT' },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ]
      },
      take: 6,
      select: {
        id: true,
        name: true,
        price: true,
        discountPrice: true,
        images: true,
        brand: true,
        category: { select: { name: true } }
      },
      orderBy: { averageRating: 'desc' }
    });
    return products;
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
        variants: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
        variants: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  static async updateProduct(id: string, data: any) {
    const { stock, variants, price, discountPrice, ...productData } = data;
    const updateData: any = { ...productData };
    
    if (price !== undefined) updateData.price = price;
    if (discountPrice !== undefined || price !== undefined) {
      updateData.discountPrice = discountPrice !== undefined ? discountPrice : undefined;
      const currentPrice = price !== undefined ? price : (await prisma.product.findUnique({where: {id}}))?.price || 0;
      updateData.discountPercentage = calculateDiscountPercentage(currentPrice, discountPrice || null);
    }
    
    if (stock !== undefined) {
      updateData.inventory = {
        upsert: {
          create: { stock },
          update: { stock }
        }
      };
    }

    if (variants !== undefined) {
      updateData.variants = {
        deleteMany: {},
        create: variants
      };
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: { inventory: true, variants: true, category: true }
    });
  }

  static async deleteProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
  }

  static async updateStock(productId: string, quantity: number) {
    return await prisma.inventory.update({
      where: { productId },
      data: { stock: { increment: quantity } }
    });
  }

  // Variant Methods
  static async addVariant(productId: string, data: any) {
    return await prisma.variant.create({
      data: {
        productId,
        ...data
      }
    });
  }

  static async updateVariant(productId: string, variantId: string, data: any) {
    return await prisma.variant.update({
      where: { id: variantId, productId },
      data
    });
  }

  static async deleteVariant(productId: string, variantId: string) {
    return await prisma.variant.delete({
      where: { id: variantId, productId }
    });
  }
}
