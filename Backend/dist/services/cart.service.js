"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CartService {
    static async getCart(userId) {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } }
            });
        }
        return cart;
    }
    static async addItem(userId, productId, quantity = 1) {
        const cart = await this.getCart(userId);
        await prisma.cartItem.upsert({
            where: {
                cartId_productId: { cartId: cart.id, productId }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                cartId: cart.id,
                productId,
                quantity
            }
        });
        return await this.getCart(userId);
    }
    static async updateItem(userId, productId, quantity) {
        const cart = await this.getCart(userId);
        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: { cartId_productId: { cartId: cart.id, productId } }
            });
        }
        else {
            await prisma.cartItem.update({
                where: { cartId_productId: { cartId: cart.id, productId } },
                data: { quantity }
            });
        }
        return await this.getCart(userId);
    }
    static async removeItem(userId, productId) {
        const cart = await this.getCart(userId);
        await prisma.cartItem.delete({
            where: { cartId_productId: { cartId: cart.id, productId } }
        });
        return await this.getCart(userId);
    }
    static async clearCart(userId) {
        const cart = await this.getCart(userId);
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        return await this.getCart(userId);
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map