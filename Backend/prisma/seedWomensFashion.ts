import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed Women's Fashion products...");
  
  // Create Category if it doesn't exist
  let category = await prisma.category.findUnique({
    where: { name: "Women's Fashion" }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Women's Fashion",
        description: "Premium clothing and apparel for women."
      }
    });
    console.log(`Created category: ${category.name}`);
  }

  // Load products JSON
  // We'll read from a predefined location, or we can just parse a hardcoded array to ensure it works instantly
  const products = [
    {
      name: "Midnight Bloom Silk Wrap Dress",
      slug: "midnight-bloom-silk-wrap-dress",
      description: "Exude elegance in our Midnight Bloom Silk Wrap Dress. Crafted from 100% pure mulberry silk, this dress features a delicate floral print on a rich navy background. The flattering wrap silhouette cinches at the waist, while the flowing midi skirt offers graceful movement. Perfect for evening events or romantic dinners, it pairs beautifully with strappy heels and minimalist jewelry.",
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612336307409-8cce3780f4d4?w=800&auto=format&fit=crop"
      ],
      brand: "Luxe Label",
      sku: "WF-DR-001",
      price: 4500,
      discountPrice: 3800,
      discountPercentage: 16,
      stockQuantity: 50,
      averageRating: 4.8,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 20},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 15}
      ]
    },
    {
      name: "Classic Tailored Linen Blazer Set",
      slug: "classic-tailored-linen-blazer-set",
      description: "Command the room in this meticulously tailored two-piece linen blazer set. Featuring a structured double-breasted blazer and matching high-waisted wide-leg trousers, this set blends professional sharpness with breathable summer comfort. The premium European linen ensures you stay cool during long board meetings or chic brunch outings.",
      images: [
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop"
      ],
      brand: "Aura",
      sku: "WF-CO-002",
      price: 6200,
      discountPrice: 5500,
      discountPercentage: 11,
      stockQuantity: 30,
      averageRating: 4.6,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 10},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 10},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 10}
      ]
    },
    {
      name: "Emerald Satin Evening Gown",
      slug: "emerald-satin-evening-gown",
      description: "Make a statement with our Emerald Satin Evening Gown. This floor-length masterpiece features a sophisticated cowl neckline, delicate spaghetti straps, and a daring thigh-high slit. The lustrous satin drapes flawlessly over the body, catching the light with every step. An absolute must-have for gala events or formal weddings.",
      images: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?w=800&auto=format&fit=crop"
      ],
      brand: "Vogue Essence",
      sku: "WF-DR-003",
      price: 8900,
      discountPrice: 7500,
      discountPercentage: 16,
      stockQuantity: 20,
      averageRating: 4.9,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "XS", additionalPrice: 0, stockQuantity: 5},
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 10},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 5}
      ]
    },
    {
      name: "Vintage Wash High-Waist Wide Jeans",
      slug: "vintage-wash-high-waist-wide-jeans",
      description: "Embrace 90s nostalgia with these Vintage Wash High-Waist Wide Jeans. Crafted from rigid 100% organic cotton denim, they offer a figure-hugging fit at the waist before flaring out into a dramatic wide leg. The subtle distressing and faded wash give them an authentic lived-in feel from day one.",
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop"
      ],
      brand: "Denim Co.",
      sku: "WF-JN-004",
      price: 2800,
      discountPrice: 2200,
      discountPercentage: 21,
      stockQuantity: 100,
      averageRating: 4.5,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "26", additionalPrice: 0, stockQuantity: 25},
        {name: "Size", value: "28", additionalPrice: 0, stockQuantity: 40},
        {name: "Size", value: "30", additionalPrice: 0, stockQuantity: 35}
      ]
    },
    {
      name: "Ribbed Knit Turtleneck Sweater",
      slug: "ribbed-knit-turtleneck-sweater",
      description: "Stay incredibly warm without sacrificing style in our Ribbed Knit Turtleneck Sweater. Woven from a luxurious merino wool blend, this fitted sweater provides exceptional insulation while remaining breathable. Its seamless construction and versatile camel hue make it the ultimate winter wardrobe staple.",
      images: [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop"
      ],
      brand: "Winter Whisper",
      sku: "WF-TP-005",
      price: 3200,
      discountPrice: 2500,
      discountPercentage: 22,
      stockQuantity: 75,
      averageRating: 4.7,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 25},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 25},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 25}
      ]
    },
    {
      name: "Pleated Chiffon Midi Skirt",
      slug: "pleated-chiffon-midi-skirt",
      description: "Feminine and fluid, this Pleated Chiffon Midi Skirt brings a touch of romance to any ensemble. The accordion pleats hold their shape perfectly, while the lightweight chiffon creates a beautiful swaying motion as you walk. Features a comfortable elasticated waistband concealed by a smooth satin ribbon.",
      images: [
        "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&auto=format&fit=crop"
      ],
      brand: "Aura",
      sku: "WF-SK-006",
      price: 2400,
      discountPrice: 1900,
      discountPercentage: 21,
      stockQuantity: 60,
      averageRating: 4.4,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 20},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 20},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 20}
      ]
    },
    {
      name: "Sculpt Activewear Leggings",
      slug: "sculpt-activewear-leggings",
      description: "Push your limits in our Sculpt Activewear Leggings. Engineered with high-compression, moisture-wicking fabric, these leggings provide unparalleled support during high-intensity workouts. The seamless high waistband ensures a slip-free fit, while the hidden pocket safely stores your keys. Squat-proof and stylish.",
      images: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&auto=format&fit=crop"
      ],
      brand: "FlexFit",
      sku: "WF-AW-007",
      price: 1800,
      discountPrice: 1400,
      discountPercentage: 22,
      stockQuantity: 150,
      averageRating: 4.8,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "XS", additionalPrice: 0, stockQuantity: 30},
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 50},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 50},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 20}
      ]
    },
    {
      name: "Bohemian Printed Maxi Dress",
      slug: "bohemian-printed-maxi-dress",
      description: "Channel free-spirited vibes with this Bohemian Printed Maxi Dress. Featuring a relaxed tiered skirt, billowy poet sleeves, and intricate paisley prints, it is the perfect outfit for beach vacations or summer festivals. The lightweight cotton fabric ensures maximum breathability under the sun.",
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515347619252-12f679788f04?w=800&auto=format&fit=crop"
      ],
      brand: "Wanderlust",
      sku: "WF-DR-008",
      price: 3500,
      discountPrice: 2800,
      discountPercentage: 20,
      stockQuantity: 40,
      averageRating: 4.3,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 10}
      ]
    },
    {
      name: "Classic Oversized Denim Jacket",
      slug: "classic-oversized-denim-jacket",
      description: "An essential layering piece, this Classic Oversized Denim Jacket adds instant cool to any outfit. Cut for a relaxed, slouchy fit, it features dropped shoulders, silver-tone hardware, and deep functional pockets. Throw it over a floral dress or pair it with jeans for a timeless double-denim look.",
      images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop"
      ],
      brand: "Denim Co.",
      sku: "WF-OW-009",
      price: 3800,
      discountPrice: 3100,
      discountPercentage: 18,
      stockQuantity: 80,
      averageRating: 4.6,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 30},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 30},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 20}
      ]
    },
    {
      name: "Elegant Off-Shoulder Party Dress",
      slug: "elegant-off-shoulder-party-dress",
      description: "Turn heads at your next event in this Elegant Off-Shoulder Party Dress. Designed to highlight the collarbones, this fitted midi dress features a fold-over neckline and a structured bodice that provides excellent support. The premium stretch-crepe fabric hugs your curves while allowing comfortable movement.",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop"
      ],
      brand: "Luxe Label",
      sku: "WF-DR-010",
      price: 4200,
      discountPrice: 3400,
      discountPercentage: 19,
      stockQuantity: 45,
      averageRating: 4.7,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "XS", additionalPrice: 0, stockQuantity: 10},
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 20},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 15}
      ]
    },
    {
      name: "Breathable Cotton Chikankari Kurti",
      slug: "breathable-cotton-chikankari-kurti",
      description: "Embrace traditional elegance with our Breathable Cotton Chikankari Kurti. Hand-embroidered by skilled artisans in Lucknow, this kurti showcases intricate white thread work on a soft pastel base. The lightweight cotton makes it perfect for humid weather, ideal for office wear or casual family gatherings.",
      images: [
        "https://images.unsplash.com/photo-1601056551822-48286a67f0f6?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583391733958-6134b225c56c?w=800&auto=format&fit=crop"
      ],
      brand: "Heritage Threads",
      sku: "WF-ET-011",
      price: 1800,
      discountPrice: 1250,
      discountPercentage: 30,
      stockQuantity: 120,
      averageRating: 4.8,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 40},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 50},
        {name: "Size", value: "XL", additionalPrice: 0, stockQuantity: 30}
      ]
    },
    {
      name: "Wide-Leg Palazzo Pants",
      slug: "wide-leg-palazzo-pants",
      description: "Experience unparalleled comfort with our Wide-Leg Palazzo Pants. Flowy, airy, and incredibly chic, these pants feature a smocked waistband for a custom fit. Pair them with a fitted crop top for a balanced silhouette, or with a matching tunic for an elevated loungewear look.",
      images: [
        "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611042553365-9b101441c135?w=800&auto=format&fit=crop"
      ],
      brand: "Aura",
      sku: "WF-BT-012",
      price: 1500,
      discountPrice: 1100,
      discountPercentage: 26,
      stockQuantity: 85,
      averageRating: 4.4,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "Free Size", additionalPrice: 0, stockQuantity: 85}
      ]
    },
    {
      name: "Tailored Professional Pencil Skirt",
      slug: "tailored-professional-pencil-skirt",
      description: "The cornerstone of any professional wardrobe, our Tailored Pencil Skirt is designed for confidence. Cut to hit just below the knee, it features a back slit for ease of movement and a discreet back zipper. The premium stretch-blend fabric ensures it maintains its crisp shape from 9 to 5 and beyond.",
      images: [
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop"
      ],
      brand: "Vogue Essence",
      sku: "WF-SK-013",
      price: 2100,
      discountPrice: 1600,
      discountPercentage: 23,
      stockQuantity: 50,
      averageRating: 4.5,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 20},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 15}
      ]
    },
    {
      name: "Belted Utility Jumpsuit",
      slug: "belted-utility-jumpsuit",
      description: "Get ready in sixty seconds with this trendy Belted Utility Jumpsuit. Featuring a crisp collar, button-down front, and multiple functional pockets, it blends utilitarian design with feminine tailoring. The adjustable D-ring belt cinches the waist perfectly. Pair with sneakers for a casual day out or ankle boots for a night look.",
      images: [
        "https://images.unsplash.com/photo-1485230895905-31d05071a991?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
      ],
      brand: "Urban Chic",
      sku: "WF-JP-014",
      price: 4200,
      discountPrice: 3600,
      discountPercentage: 14,
      stockQuantity: 35,
      averageRating: 4.6,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 10},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 10}
      ]
    },
    {
      name: "Sequined Party Crop Top",
      slug: "sequined-party-crop-top",
      description: "Shine on the dancefloor with our Sequined Party Crop Top. This glamorous piece is entirely hand-embroidered with light-catching sequins. It features a modern square neckline and a comfortable inner lining so it never scratches. Pair it beautifully with a high-waisted skirt or wide-leg trousers for a show-stopping outfit.",
      images: [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop"
      ],
      brand: "Luxe Label",
      sku: "WF-TP-015",
      price: 2800,
      discountPrice: 2200,
      discountPercentage: 21,
      stockQuantity: 60,
      averageRating: 4.2,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "XS", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 25},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 20}
      ]
    },
    {
      name: "Cozy Oversized Long Shrug",
      slug: "cozy-oversized-long-shrug",
      description: "Wrap yourself in absolute comfort with our Cozy Oversized Long Shrug. Knitted with ultra-soft, plush yarn, this open-front cardigan drapes beautifully past the knees. It features deep pockets and a relaxed fit, making it the perfect layering piece for lounging at home or chilly flights.",
      images: [
        "https://images.unsplash.com/photo-1434389670869-c49b6aa5d800?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop"
      ],
      brand: "Winter Whisper",
      sku: "WF-OW-016",
      price: 2600,
      discountPrice: 1900,
      discountPercentage: 26,
      stockQuantity: 90,
      averageRating: 4.8,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "Free Size", additionalPrice: 0, stockQuantity: 90}
      ]
    },
    {
      name: "Elegant Silk Saree with Blouse Piece",
      slug: "elegant-silk-saree-with-blouse-piece",
      description: "Celebrate tradition in style with this Elegant Silk Saree. Woven from premium art silk, it features intricate golden zari borders and a stunning pallu that reflects timeless craftsmanship. The saree drapes fluidly and is lightweight, ensuring you look regal while remaining comfortable throughout wedding ceremonies and festivals.",
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583391733958-6134b225c56c?w=800&auto=format&fit=crop"
      ],
      brand: "Heritage Threads",
      sku: "WF-ET-017",
      price: 6500,
      discountPrice: 4800,
      discountPercentage: 26,
      stockQuantity: 25,
      averageRating: 4.9,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "Free Size", additionalPrice: 0, stockQuantity: 25}
      ]
    },
    {
      name: "Seamless Sports Bra",
      slug: "seamless-sports-bra",
      description: "Experience zero distractions during your workout with our Seamless Sports Bra. Offering medium support, it features a classic racerback design, removable padding, and a wide underbust band that stays perfectly in place. The sweat-wicking fabric ensures you stay dry and confident from yoga to HIIT.",
      images: [
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop"
      ],
      brand: "FlexFit",
      sku: "WF-AW-018",
      price: 1200,
      discountPrice: 850,
      discountPercentage: 29,
      stockQuantity: 150,
      averageRating: 4.7,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 50},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 60},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 40}
      ]
    },
    {
      name: "A-Line Faux Leather Mini Skirt",
      slug: "a-line-faux-leather-mini-skirt",
      description: "Add an edgy touch to your wardrobe with our A-Line Faux Leather Mini Skirt. Crafted from premium, buttery-soft vegan leather, this skirt features a flattering high-waist silhouette and a sleek side zipper. Perfect for transitioning from day to night—pair with a chunky knit or a silk camisole.",
      images: [
        "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&auto=format&fit=crop"
      ],
      brand: "Urban Chic",
      sku: "WF-SK-019",
      price: 2200,
      discountPrice: 1750,
      discountPercentage: 20,
      stockQuantity: 40,
      averageRating: 4.3,
      status: "IN_STOCK",
      isFeatured: false,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 15},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 10}
      ]
    },
    {
      name: "Classic Crisp White Shirt",
      slug: "classic-crisp-white-shirt",
      description: "The ultimate wardrobe essential. Our Classic Crisp White Shirt is tailored from premium Egyptian cotton, offering a flawless drape and breathability. Featuring a sharp collar, button cuffs, and a slightly oversized fit, it is endlessly versatile. Tuck it into tailored trousers for the office or knot it over denim on weekends.",
      images: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop"
      ],
      brand: "Vogue Essence",
      sku: "WF-TP-020",
      price: 2900,
      discountPrice: 2400,
      discountPercentage: 17,
      stockQuantity: 100,
      averageRating: 4.9,
      status: "IN_STOCK",
      isFeatured: true,
      variants: [
        {name: "Size", value: "S", additionalPrice: 0, stockQuantity: 30},
        {name: "Size", value: "M", additionalPrice: 0, stockQuantity: 40},
        {name: "Size", value: "L", additionalPrice: 0, stockQuantity: 30}
      ]
    }
  ];

  for (const prod of products) {
    // Check if product exists to avoid crashing on re-run
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug }
    });
    
    if (existing) {
      console.log(`Product ${prod.name} already exists. Skipping.`);
      continue;
    }

    const { stockQuantity, variants, ...productData } = prod;

    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        status: "IN_STOCK",
        categoryId: category.id,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        inventory: {
          create: {
            stock: stockQuantity
          }
        },
        variants: {
          create: variants.map(v => ({
            name: v.name,
            value: v.value,
            additionalPrice: v.additionalPrice,
            stockQuantity: v.stockQuantity
          }))
        }
      }
    });

    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
