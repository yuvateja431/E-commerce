import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding new Categories and Products...");
    const categoriesData = [
        { name: "Headphones", description: "All kinds of headphones" },
        { name: "Computer Accessories", description: "Keyboards, mice, and more" },
        { name: "Electronics", description: "General electronics" },
        { name: "Audio Devices", description: "Speakers, soundbars, interfaces" },
        { name: "Gaming Accessories", description: "Controllers, headsets, mats" }
    ];
    const categoryMap = {};
    // 1. Create or ensure Categories exist
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                description: cat.description
            }
        });
        categoryMap[cat.name] = category.id;
        console.log(`Ensured category exists: ${cat.name}`);
    }
    // 2. Add sample products for the new categories
    const productsData = [
        {
            name: "Pro Gaming Headset",
            description: "Brand: GamePro\nStatus: Active\nSurround sound gaming headset.",
            price: 3499.00,
            categoryId: categoryMap["Headphones"],
            images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop"],
            stock: 45
        },
        {
            name: "Mechanical Keyboard RGB",
            description: "Brand: KeyMaster\nStatus: Active\nClicky mechanical keyboard with RGB backlighting.",
            price: 5999.00,
            categoryId: categoryMap["Computer Accessories"],
            images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop"],
            stock: 120
        },
        {
            name: "Smart TV 4K",
            description: "Brand: VisionPlus\nStatus: Active\n55-inch 4K Smart TV.",
            price: 45999.00,
            categoryId: categoryMap["Electronics"],
            images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop"],
            stock: 15
        },
        {
            name: "Studio Monitors Pair",
            description: "Brand: SoundTech\nStatus: Active\nProfessional active studio monitors.",
            price: 15499.00,
            categoryId: categoryMap["Audio Devices"],
            images: ["https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000&auto=format&fit=crop"],
            stock: 30
        },
        {
            name: "Wireless Gaming Controller",
            description: "Brand: GamePro\nStatus: Active\nErgonomic wireless controller.",
            price: 2999.00,
            categoryId: categoryMap["Gaming Accessories"],
            images: ["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=1000&auto=format&fit=crop"],
            stock: 80
        }
    ];
    for (const product of productsData) {
        const { stock, ...productDetails } = product;
        const existingProduct = await prisma.product.findFirst({
            where: { name: product.name }
        });
        if (!existingProduct) {
            await prisma.product.create({
                data: {
                    ...productDetails,
                    inventory: {
                        create: { stock }
                    }
                }
            });
            console.log(`Product created: ${product.name}`);
        }
        else {
            console.log(`Product already exists: ${product.name}`);
        }
    }
    console.log("Database seeded successfully!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
