import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");
  
  // First, create some categories
  const categoriesData = [
    { name: "Laptops", description: "High-performance laptops" },
    { name: "Smartphones", description: "Latest mobile devices" },
    { name: "Headphones", description: "Audio equipment" },
    { name: "Men's Fashion", description: "Apparel for men" },
    { name: "Women's Fashion", description: "Apparel for women" },
    { name: "Shoes", description: "Footwear" },
    { name: "Watches", description: "Timepieces" },
    { name: "Home Appliances", description: "Appliances for home" },
    { name: "Furniture", description: "Home and office furniture" },
    { name: "Beauty Products", description: "Cosmetics and skincare" }
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
    categories[cat.name] = created.id;
  }

  // Define 10 realistic products
  const productsData = [
    {
      name: "MacBook Pro 16-inch",
      slug: "macbook-pro-16-inch",
      description: "Supercharged by M3 Pro or M3 Max, MacBook Pro takes its power and efficiency further than ever.",
      price: 2499.00,
      discountPrice: 2399.00,
      discountPercentage: 4,
      images: ["https://placehold.co/600x400/png?text=MacBook+Pro+16"],
      brand: "Apple",
      sku: "APP-MBP-16",
      categoryId: categories["Laptops"],
      averageRating: 4.8,
      reviewCount: 124,
      isFeatured: true,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Storage", value: "512GB", additionalPrice: 0, sku: "APP-MBP-16-512", stockQuantity: 50 },
          { name: "Storage", value: "1TB", additionalPrice: 200, sku: "APP-MBP-16-1TB", stockQuantity: 30 }
        ]
      }
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.",
      price: 1299.99,
      discountPrice: null,
      discountPercentage: 0,
      images: ["https://placehold.co/600x400/png?text=Galaxy+S24+Ultra"],
      brand: "Samsung",
      sku: "SAM-S24U",
      categoryId: categories["Smartphones"],
      averageRating: 4.9,
      reviewCount: 312,
      isFeatured: true,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Color", value: "Titanium Black", additionalPrice: 0, sku: "SAM-S24U-BLK", stockQuantity: 100 },
          { name: "Color", value: "Titanium Gray", additionalPrice: 0, sku: "SAM-S24U-GRY", stockQuantity: 80 }
        ]
      }
    },
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description: "Industry Leading Noise Canceling Wireless Headphones with Auto Noise Canceling Optimizer.",
      price: 398.00,
      discountPrice: 348.00,
      discountPercentage: 12,
      images: ["https://placehold.co/600x400/png?text=Sony+Headphones"],
      brand: "Sony",
      sku: "SONY-WH1000XM5",
      categoryId: categories["Headphones"],
      averageRating: 4.7,
      reviewCount: 856,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Color", value: "Black", additionalPrice: 0, sku: "SONY-WH1000XM5-BLK", stockQuantity: 150 },
          { name: "Color", value: "Silver", additionalPrice: 0, sku: "SONY-WH1000XM5-SLV", stockQuantity: 120 }
        ]
      }
    },
    {
      name: "Levi's 501 Original Fit Jeans",
      slug: "levis-501-original-fit-jeans",
      description: "The original blue jean since 1873. The original straight fit.",
      price: 79.50,
      discountPrice: 59.50,
      discountPercentage: 25,
      images: ["https://placehold.co/600x400/png?text=Levis+Jeans"],
      brand: "Levi's",
      sku: "LEV-501-ORG",
      categoryId: categories["Men's Fashion"],
      averageRating: 4.5,
      reviewCount: 1042,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Size", value: "32x32", additionalPrice: 0, sku: "LEV-501-ORG-3232", stockQuantity: 40 },
          { name: "Size", value: "34x32", additionalPrice: 0, sku: "LEV-501-ORG-3432", stockQuantity: 35 }
        ]
      }
    },
    {
      name: "Elegant Floral Summer Dress",
      slug: "elegant-floral-summer-dress",
      description: "Lightweight and breathable floral print summer dress, perfect for casual outings.",
      price: 49.99,
      discountPrice: null,
      discountPercentage: 0,
      images: ["https://placehold.co/600x400/png?text=Summer+Dress"],
      brand: "Zara",
      sku: "ZAR-FLR-DRS",
      categoryId: categories["Women's Fashion"],
      averageRating: 4.4,
      reviewCount: 56,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Size", value: "Small", additionalPrice: 0, sku: "ZAR-FLR-DRS-S", stockQuantity: 20 },
          { name: "Size", value: "Medium", additionalPrice: 0, sku: "ZAR-FLR-DRS-M", stockQuantity: 25 },
          { name: "Size", value: "Large", additionalPrice: 0, sku: "ZAR-FLR-DRS-L", stockQuantity: 15 }
        ]
      }
    },
    {
      name: "Nike Air Force 1 '07",
      slug: "nike-air-force-1-07",
      description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
      price: 115.00,
      discountPrice: null,
      discountPercentage: 0,
      images: ["https://placehold.co/600x400/png?text=Nike+Air+Force+1"],
      brand: "Nike",
      sku: "NIK-AF1-07",
      categoryId: categories["Shoes"],
      averageRating: 4.8,
      reviewCount: 2310,
      isFeatured: true,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Size", value: "US 9", additionalPrice: 0, sku: "NIK-AF1-07-9", stockQuantity: 60 },
          { name: "Size", value: "US 10", additionalPrice: 0, sku: "NIK-AF1-07-10", stockQuantity: 55 }
        ]
      }
    },
    {
      name: "Rolex Submariner Date",
      slug: "rolex-submariner-date",
      description: "The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial.",
      price: 10250.00,
      discountPrice: null,
      discountPercentage: 0,
      images: ["https://placehold.co/600x400/png?text=Rolex+Submariner"],
      brand: "Rolex",
      sku: "ROL-SUB-DATE",
      categoryId: categories["Watches"],
      averageRating: 5.0,
      reviewCount: 42,
      isFeatured: true,
      status: ProductStatus.PREORDER,
      variants: {
        create: [
          { name: "Dial", value: "Black", additionalPrice: 0, sku: "ROL-SUB-DATE-BLK", stockQuantity: 5 }
        ]
      }
    },
    {
      name: "Dyson V15 Detect Absolute",
      slug: "dyson-v15-detect-absolute",
      description: "Dyson's most powerful, intelligent cordless vacuum. With laser illumination.",
      price: 749.99,
      discountPrice: 649.99,
      discountPercentage: 13,
      images: ["https://placehold.co/600x400/png?text=Dyson+V15"],
      brand: "Dyson",
      sku: "DYS-V15-ABS",
      categoryId: categories["Home Appliances"],
      averageRating: 4.6,
      reviewCount: 512,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Color", value: "Yellow/Nickel", additionalPrice: 0, sku: "DYS-V15-ABS-YN", stockQuantity: 40 }
        ]
      }
    },
    {
      name: "ErgoChair Pro",
      slug: "ergochair-pro",
      description: "A fully adjustable ergonomic desk chair that provides back support and promotes good posture.",
      price: 499.00,
      discountPrice: 449.00,
      discountPercentage: 10,
      images: ["https://placehold.co/600x400/png?text=ErgoChair+Pro"],
      brand: "Autonomous",
      sku: "AUT-ERGP",
      categoryId: categories["Furniture"],
      averageRating: 4.3,
      reviewCount: 189,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Color", value: "All Black", additionalPrice: 0, sku: "AUT-ERGP-BLK", stockQuantity: 25 },
          { name: "Color", value: "Cool Gray", additionalPrice: 0, sku: "AUT-ERGP-GRY", stockQuantity: 15 }
        ]
      }
    },
    {
      name: "Estée Lauder Advanced Night Repair",
      slug: "estee-lauder-advanced-night-repair",
      description: "Synchronized Multi-Recovery Complex. The #1 face serum in the US.",
      price: 115.00,
      discountPrice: null,
      discountPercentage: 0,
      images: ["https://placehold.co/600x400/png?text=Estee+Lauder+Serum"],
      brand: "Estée Lauder",
      sku: "EST-ANR-1",
      categoryId: categories["Beauty Products"],
      averageRating: 4.7,
      reviewCount: 3400,
      isFeatured: false,
      status: ProductStatus.IN_STOCK,
      variants: {
        create: [
          { name: "Size", value: "1.7 oz", additionalPrice: 0, sku: "EST-ANR-1-17", stockQuantity: 200 },
          { name: "Size", value: "3.9 oz", additionalPrice: 95.00, sku: "EST-ANR-1-39", stockQuantity: 100 }
        ]
      }
    }
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    });
  }

  console.log("Database seeded successfully with 10 diverse products and variants!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
