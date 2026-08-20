import { PrismaClient, ProductStatus } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding premium Accessories products...");
    const categoriesData = [
        { name: "Mobile Accessories", description: "Chargers, cases, power banks, and other smartphone accessories" },
        { name: "Computer Accessories", description: "Mice, keyboards, monitors, and hubs for your computer setup" },
        { name: "Fashion Accessories", description: "Sunglasses, wallets, timepieces, and luxury bags" },
        { name: "Gaming Accessories", description: "Gaming controllers, headsets, mechanical keyboards, and precision mice" }
    ];
    const categories = {};
    for (const cat of categoriesData) {
        const created = await prisma.category.upsert({
            where: { name: cat.name },
            update: { description: cat.description },
            create: cat
        });
        categories[cat.name] = created.id;
        console.log(`Ensured category: ${cat.name} (ID: ${created.id})`);
    }
    const productsData = [
        // Mobile Accessories
        {
            name: "Anker PowerPort III 65W Pod",
            slug: "anker-powerport-iii-65w-pod",
            description: "Powerful 65W fast charger with PowerIQ 3.0 technology. Charge your MacBook, iPad, or iPhone at top speed with ultra-compact form factor.",
            price: 2499.00,
            discountPrice: 1999.00,
            images: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop"],
            brand: "Anker",
            sku: "ANK-PP3-65W",
            categoryId: categories["Mobile Accessories"],
            averageRating: 4.7,
            reviewCount: 382,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Charger", "Fast Charging", "Anker", "USB-C"],
            variants: {
                create: [
                    { name: "Color", value: "Midnight Black", additionalPrice: 0, sku: "ANK-PP3-65W-BLK", stockQuantity: 80 },
                    { name: "Color", value: "Arctic White", additionalPrice: 0, sku: "ANK-PP3-65W-WHT", stockQuantity: 50 }
                ]
            }
        },
        {
            name: "Spigen Tough Armor Case for iPhone 15 Pro",
            slug: "spigen-tough-armor-iphone-15-pro",
            description: "Dual-layer extreme drop protection. Features built-in kickstand, raised lips to protect screen and camera, and Air Cushion technology.",
            price: 1899.00,
            discountPrice: 1399.00,
            images: ["https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=800&auto=format&fit=crop"],
            brand: "Spigen",
            sku: "SPG-TA-I15P",
            categoryId: categories["Mobile Accessories"],
            averageRating: 4.6,
            reviewCount: 194,
            isFeatured: false,
            status: ProductStatus.IN_STOCK,
            tags: ["Case", "iPhone 15 Pro", "Spigen", "Tough Armor"],
            variants: {
                create: [
                    { name: "Color", value: "Gunmetal", additionalPrice: 0, sku: "SPG-TA-I15P-GM", stockQuantity: 100 },
                    { name: "Color", value: "Metal Slate", additionalPrice: 0, sku: "SPG-TA-I15P-MS", stockQuantity: 70 }
                ]
            }
        },
        {
            name: "Belkin 3-in-1 Wireless Charging Stand with MagSafe",
            slug: "belkin-3-in-1-magsafe-wireless-charging-stand",
            description: "Rethink how you charge. Charge your iPhone 15/14, Apple Watch, and AirPods simultaneously with up to 15W of fast wireless charging.",
            price: 13999.00,
            discountPrice: 12499.00,
            images: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop"],
            brand: "Belkin",
            sku: "BEL-3IN1-MS",
            categoryId: categories["Mobile Accessories"],
            averageRating: 4.8,
            reviewCount: 95,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Wireless Charger", "MagSafe", "Belkin", "3-in-1"],
            variants: {
                create: [
                    { name: "Color", value: "Black", additionalPrice: 0, sku: "BEL-3IN1-BLK", stockQuantity: 20 },
                    { name: "Color", value: "White", additionalPrice: 0, sku: "BEL-3IN1-WHT", stockQuantity: 15 }
                ]
            }
        },
        // Computer Accessories
        {
            name: "Logitech MX Master 3S Wireless Mouse",
            slug: "logitech-mx-master-3s-wireless",
            description: "An icon remastered. Silent clicks, 8K DPI tracking on any surface, and MagSpeed electromagnetic scrolling for ultimate precision and productivity.",
            price: 10995.00,
            discountPrice: 9495.00,
            images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop"],
            brand: "Logitech",
            sku: "LOG-MXM3S",
            categoryId: categories["Computer Accessories"],
            averageRating: 4.9,
            reviewCount: 720,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Mouse", "Wireless Mouse", "Logitech", "MX Master", "Ergonomic"],
            variants: {
                create: [
                    { name: "Color", value: "Graphite", additionalPrice: 0, sku: "LOG-MXM3S-GRPH", stockQuantity: 60 },
                    { name: "Color", value: "Pale Gray", additionalPrice: 0, sku: "LOG-MXM3S-PGRY", stockQuantity: 40 }
                ]
            }
        },
        {
            name: "Keychron K2 Wireless Mechanical Keyboard (Version 2)",
            slug: "keychron-k2-wireless-mechanical-keyboard",
            description: "75% layout wireless mechanical keyboard with dual connectivity (Bluetooth & Wired), Gateron switches, RGB backlighting, and a massive 4000mAh battery.",
            price: 8999.00,
            discountPrice: 7499.00,
            images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop"],
            brand: "Keychron",
            sku: "KEY-K2-V2",
            categoryId: categories["Computer Accessories"],
            averageRating: 4.8,
            reviewCount: 450,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Keyboard", "Mechanical Keyboard", "Keychron", "Wireless Keyboard"],
            variants: {
                create: [
                    { name: "Switch Type", value: "Gateron Brown", additionalPrice: 0, sku: "KEY-K2-V2-BRW", stockQuantity: 50 },
                    { name: "Switch Type", value: "Gateron Red", additionalPrice: 0, sku: "KEY-K2-V2-RED", stockQuantity: 35 },
                    { name: "Switch Type", value: "Gateron Blue", additionalPrice: 0, sku: "KEY-K2-V2-BLU", stockQuantity: 20 }
                ]
            }
        },
        {
            name: "Anker PowerExpand 8-in-1 USB-C Hub",
            slug: "anker-powerexpand-8-in-1-usb-c-hub",
            description: "Equipped with a USB-C Power Delivery port, 2 USB-A data ports, 2 HDMI ports, an Ethernet port, and a microSD/SD card reader. Dual display support up to 4K.",
            price: 5999.00,
            discountPrice: 4999.00,
            images: ["https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop"],
            brand: "Anker",
            sku: "ANK-PE-8IN1",
            categoryId: categories["Computer Accessories"],
            averageRating: 4.5,
            reviewCount: 182,
            isFeatured: false,
            status: ProductStatus.IN_STOCK,
            tags: ["USB Hub", "USB-C", "Anker", "Dongle"],
            variants: {
                create: [
                    { name: "Color", value: "Space Gray", additionalPrice: 0, sku: "ANK-PE-8IN1-SG", stockQuantity: 90 }
                ]
            }
        },
        // Fashion Accessories
        {
            name: "Ray-Ban Classic Aviator Sunglasses",
            slug: "ray-ban-classic-aviator-sunglasses",
            description: "Originally designed for U.S. aviators in 1937. Golden metal frame with iconic green crystal G-15 lenses providing high visual clarity and 100% UV protection.",
            price: 9990.00,
            discountPrice: 7990.00,
            images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop"],
            brand: "Ray-Ban",
            sku: "RB-AVI-CLASSIC",
            categoryId: categories["Fashion Accessories"],
            averageRating: 4.8,
            reviewCount: 1250,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Sunglasses", "Ray-Ban", "Aviator", "Fashion"],
            variants: {
                create: [
                    { name: "Frame Size", value: "Standard 58mm", additionalPrice: 0, sku: "RB-AVI-58MM", stockQuantity: 150 },
                    { name: "Frame Size", value: "Large 62mm", additionalPrice: 500, sku: "RB-AVI-62MM", stockQuantity: 70 }
                ]
            }
        },
        {
            name: "Fossil Men's Derrick Leather Bifold Wallet",
            slug: "fossil-derrick-leather-bifold-wallet",
            description: "Crafted in high-quality brown leather, this Derrick bifold features 8 credit card slots, 2 slip pockets, 1 bill compartment, and 1 slide-out card case.",
            price: 3495.00,
            discountPrice: 2495.00,
            images: ["https://images.unsplash.com/photo-1627124118123-ae4d4ef78bf1?w=800&auto=format&fit=crop"],
            brand: "Fossil",
            sku: "FSL-DRK-WL",
            categoryId: categories["Fashion Accessories"],
            averageRating: 4.6,
            reviewCount: 540,
            isFeatured: false,
            status: ProductStatus.IN_STOCK,
            tags: ["Wallet", "Leather Wallet", "Fossil", "Fashion"],
            variants: {
                create: [
                    { name: "Color", value: "Dark Brown", additionalPrice: 0, sku: "FSL-DRK-WL-BRN", stockQuantity: 200 },
                    { name: "Color", value: "Black", additionalPrice: 0, sku: "FSL-DRK-WL-BLK", stockQuantity: 120 }
                ]
            }
        },
        {
            name: "Daniel Wellington Classic Petite Sterling Watch",
            slug: "daniel-wellington-petite-sterling",
            description: "Features a clean black dial with silver indices and hands. Elegantly integrated with a sleek silver mesh strap, creating an ultra-modern aesthetic.",
            price: 12499.00,
            discountPrice: 10999.00,
            images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop"],
            brand: "Daniel Wellington",
            sku: "DW-PET-STERLING",
            categoryId: categories["Fashion Accessories"],
            averageRating: 4.7,
            reviewCount: 310,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Watch", "Mesh Strap", "Daniel Wellington", "Luxury"],
            variants: {
                create: [
                    { name: "Dial Size", value: "28mm", additionalPrice: 0, sku: "DW-PET-28", stockQuantity: 40 },
                    { name: "Dial Size", value: "32mm", additionalPrice: 500, sku: "DW-PET-32", stockQuantity: 30 }
                ]
            }
        },
        // Gaming Accessories
        {
            name: "Razer DeathAdder Essential Gaming Mouse",
            slug: "razer-deathadder-essential",
            description: "For more than a decade, the Razer DeathAdder line has been a mainstay in the global esports arena. Proven ergonomics, 6400 DPI optical sensor, and 5 hyperesponse buttons.",
            price: 2499.00,
            discountPrice: 1599.00,
            images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop"],
            brand: "Razer",
            sku: "RZR-DA-ESS",
            categoryId: categories["Gaming Accessories"],
            averageRating: 4.5,
            reviewCount: 2012,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Mouse", "Gaming Mouse", "Razer", "RGB", "DeathAdder"],
            variants: {
                create: [
                    { name: "Color", value: "Classic Black", additionalPrice: 0, sku: "RZR-DA-ESS-BLK", stockQuantity: 300 },
                    { name: "Color", value: "Mercury White", additionalPrice: 100, sku: "RZR-DA-ESS-WHT", stockQuantity: 150 }
                ]
            }
        },
        {
            name: "Sony PS5 DualSense Wireless Controller",
            slug: "sony-ps5-dualsense-wireless",
            description: "Discover a deeper, highly immersive gaming experience that brings the action to life in the palms of your hands with haptic feedback and dynamic triggers.",
            price: 6399.00,
            discountPrice: 5799.00,
            images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop"],
            brand: "Sony",
            sku: "SNY-PS5-DS",
            categoryId: categories["Gaming Accessories"],
            averageRating: 4.8,
            reviewCount: 1150,
            isFeatured: true,
            status: ProductStatus.IN_STOCK,
            tags: ["Controller", "PS5", "Sony", "Wireless", "Gaming"],
            variants: {
                create: [
                    { name: "Color", value: "White", additionalPrice: 0, sku: "SNY-PS5-DS-WHT", stockQuantity: 80 },
                    { name: "Color", value: "Midnight Black", additionalPrice: 0, sku: "SNY-PS5-DS-BLK", stockQuantity: 60 },
                    { name: "Color", value: "Cosmic Red", additionalPrice: 200, sku: "SNY-PS5-DS-RED", stockQuantity: 40 }
                ]
            }
        },
        {
            name: "HyperX Cloud II Wireless Gaming Headset",
            slug: "hyperx-cloud-ii-wireless",
            description: "Legendary comfort, wireless freedom. Signature HyperX memory foam, durable aluminum frame, custom-tuned virtual 7.1 surround sound, and detachable noise-canceling mic.",
            price: 13990.00,
            discountPrice: 11490.00,
            images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop"],
            brand: "HyperX",
            sku: "HPX-C2-WL",
            categoryId: categories["Gaming Accessories"],
            averageRating: 4.7,
            reviewCount: 940,
            isFeatured: false,
            status: ProductStatus.IN_STOCK,
            tags: ["Headset", "Gaming Headset", "HyperX", "Wireless Headset"],
            variants: {
                create: [
                    { name: "Color", value: "Black/Red", additionalPrice: 0, sku: "HPX-C2-WL-RD", stockQuantity: 120 }
                ]
            }
        }
    ];
}
// Luxury Skincare
{
    name: "Estée Lauder Advanced Night Repair Synchronized Multi-Recovery Complex",
        slug;
    "estee-lauder-advanced-night-repair",
        description;
    "High-performance serum that reduces signs of aging, hydrates and improves skin radiance.",
        price;
    119900,
        discountPrice;
    109900,
        images;
    ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop"],
        brand;
    "Estée Lauder",
        sku;
    "EL-ANR-2026",
        categoryId;
    categories["Fashion Accessories"],
        averageRating;
    4.9,
        reviewCount;
    200,
        isFeatured;
    true,
        status;
    ProductStatus.IN_STOCK,
        tags;
    ["Skincare", "Serum", "Estée Lauder", "Advanced Night Repair"],
        variants;
    {
        create: [
            { name: "Size", value: "30ml", additionalPrice: 0, sku: "EL-ANR-30ML", stockQuantity: 200 }
        ];
    }
}
;
for (const product of productsData) {
    const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
    });
    if (existing) {
        console.log(`Product "${product.name}" already exists. Skipping.`);
        continue;
    }
    const { variants, ...prodData } = product;
    const created = await prisma.product.create({
        data: {
            ...prodData,
            inventory: {
                create: { stock: 1000 }
            },
            variants: variants
        }
    });
    console.log(`Seeded product: ${created.name} (SKU: ${created.sku})`);
}
console.log("Accessories seeding completed successfully!");
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
