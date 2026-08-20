import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
async function main() {
    console.log("Starting Admin Products Seed...");
    // 1. Create all Categories
    const categoriesToCreate = [
        "Women's Fashion",
        "Men's Fashion",
        "Accessories",
        "Computer Accessories",
        "Headphones",
        "Audio Devices",
        "Gaming Accessories",
        "Laptops",
        "Smartphones",
        "Shoes",
        "Watches",
        "Home Appliances",
        "Furniture",
        "Beauty Products",
        "Electronics"
    ];
    const categoryMap = {};
    for (const catName of categoriesToCreate) {
        const existing = await prisma.category.findUnique({ where: { name: catName } });
        if (!existing) {
            const cat = await prisma.category.create({
                data: { name: catName, description: `${catName} products` }
            });
            categoryMap[catName] = cat.id;
        }
        else {
            categoryMap[catName] = existing.id;
        }
    }
    // 2. Sample Products Data with variants
    const sampleProducts = [
        {
            name: "Floral Summer Dress",
            brand: "Zara",
            sku: "W-DR-001",
            description: "<p>A beautiful floral summer dress for women.</p><ul><li>Breathable material</li><li>Vibrant colors</li></ul>",
            price: 2499.00,
            discountPrice: 1999.00,
            categoryId: categoryMap["Women's Fashion"],
            images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80"],
            stock: 50,
            tags: ["Summer", "Floral", "Dress"],
            variants: [
                { name: "Size", value: "S", additionalPrice: 0, stockQuantity: 10 },
                { name: "Size", value: "M", additionalPrice: 0, stockQuantity: 20 },
                { name: "Size", value: "L", additionalPrice: 0, stockQuantity: 20 }
            ]
        },
        {
            name: "Classic Denim Jacket",
            brand: "Levi's",
            sku: "M-JK-001",
            description: "<p>A timeless classic denim jacket for men.</p>",
            price: 3499.00,
            categoryId: categoryMap["Men's Fashion"],
            images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80"],
            stock: 30,
            tags: ["Denim", "Jacket", "Classic"],
            variants: [
                { name: "Size", value: "M", additionalPrice: 0, stockQuantity: 15 },
                { name: "Size", value: "L", additionalPrice: 0, stockQuantity: 15 }
            ]
        },
        {
            name: "MacBook Pro 16\"",
            brand: "Apple",
            sku: "L-MBP-16",
            description: "<p>Supercharged for pros.</p>",
            price: 199900.00,
            categoryId: categoryMap["Laptops"],
            images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"],
            stock: 15,
            tags: ["Apple", "Mac", "Laptop"],
            variants: [
                { name: "RAM", value: "16GB", additionalPrice: 0, stockQuantity: 10 },
                { name: "RAM", value: "32GB", additionalPrice: 40000, stockQuantity: 5 },
                { name: "Storage", value: "512GB", additionalPrice: 0, stockQuantity: 10 },
                { name: "Storage", value: "1TB", additionalPrice: 20000, stockQuantity: 5 }
            ]
        },
        {
            name: "Running Sneakers",
            brand: "Nike",
            sku: "S-NK-001",
            description: "<p>Comfortable running shoes for daily use.</p>",
            price: 4999.00,
            categoryId: categoryMap["Shoes"],
            images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"],
            stock: 100,
            tags: ["Running", "Sneakers", "Sports"],
            variants: [
                { name: "Size", value: "8", additionalPrice: 0, stockQuantity: 30 },
                { name: "Size", value: "9", additionalPrice: 0, stockQuantity: 40 },
                { name: "Size", value: "10", additionalPrice: 0, stockQuantity: 30 },
                { name: "Color", value: "Red", additionalPrice: 0, stockQuantity: 50 },
                { name: "Color", value: "Black", additionalPrice: 0, stockQuantity: 50 }
            ]
        }
    ];
    for (const product of sampleProducts) {
        const { stock, variants, tags, ...productData } = product;
        const finalSlug = generateSlug(product.name);
        const existingProduct = await prisma.product.findUnique({ where: { slug: finalSlug } });
        if (!existingProduct) {
            await prisma.product.create({
                data: {
                    ...productData,
                    slug: finalSlug,
                    tags,
                    inventory: {
                        create: { stock }
                    },
                    variants: {
                        create: variants
                    }
                }
            });
            console.log(`Created product: ${product.name}`);
        }
    }
    console.log("Seed completed!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
