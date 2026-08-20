import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class WishlistService {
    static async getWishlist(userId) {
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId },
                include: { items: { include: { product: true } } }
            });
        }
        return wishlist;
    }
    static async addItem(userId, productId) {
        const wishlist = await this.getWishlist(userId);
        return await prisma.wishlistItem.upsert({
            where: {
                wishlistId_productId: { wishlistId: wishlist.id, productId }
            },
            update: {},
            create: {
                wishlistId: wishlist.id,
                productId
            }
        });
    }
    static async removeItem(userId, productId) {
        const wishlist = await this.getWishlist(userId);
        return await prisma.wishlistItem.delete({
            where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }
        });
    }
}
