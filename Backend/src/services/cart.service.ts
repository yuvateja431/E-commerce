import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export class CartService {
  static async getCart(userId: string) {
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

  static async addItem(userId: string, productId: string, quantity: number = 1) {
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

  static async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } }
      });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity }
      });
    }
    return await this.getCart(userId);
  }

  static async removeItem(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });
    return await this.getCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    return await this.getCart(userId);
  }
}
