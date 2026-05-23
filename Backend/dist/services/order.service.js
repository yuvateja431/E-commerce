"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const cart_service_1 = require("./cart.service");
const prisma = new client_1.PrismaClient();
class OrderService {
    static async createOrder(userId, data) {
        const { shippingAddress, paymentMethod, couponCode, instantOrder } = data;
        let itemsToProcess = [];
        let cartId;
        if (instantOrder) {
            const product = await prisma.product.findUnique({
                where: { id: instantOrder.productId },
                include: { variants: true }
            });
            if (!product) {
                throw new ApiError_1.ApiError(404, "Product not found");
            }
            let price = product.discountPrice || product.price;
            if (instantOrder.variantId) {
                const variant = product.variants.find((v) => v.id === instantOrder.variantId);
                if (variant) {
                    price += variant.additionalPrice;
                }
            }
            itemsToProcess = [
                {
                    productId: instantOrder.productId,
                    variantId: instantOrder.variantId,
                    quantity: instantOrder.quantity,
                    product: {
                        ...product,
                        price
                    }
                }
            ];
        }
        else {
            const cart = await cart_service_1.CartService.getCart(userId);
            if (!cart.items || cart.items.length === 0) {
                throw new ApiError_1.ApiError(400, "Cart is empty");
            }
            itemsToProcess = cart.items;
            cartId = cart.id;
        }
        let totalAmount = itemsToProcess.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);
        let couponId;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode }
            });
            if (coupon && coupon.status === "ACTIVE" && coupon.expiryDate > new Date()) {
                if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
                    throw new ApiError_1.ApiError(400, `Minimum order value for this coupon is ${coupon.minOrderAmount}`);
                }
                if (coupon.discountType === "PERCENTAGE") {
                    totalAmount -= (totalAmount * coupon.discountValue) / 100;
                }
                else {
                    totalAmount -= coupon.discountValue;
                }
                couponId = coupon.id;
            }
        }
        // Handle Address creation/lookup
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        // Create the address for this order based on the provided shipping address
        const address = await prisma.address.create({
            data: {
                userId,
                fullName: user.firstName + " " + user.lastName,
                phone: "0000000000", // Placeholder if not provided
                addressLine1: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                addressType: "HOME",
            }
        });
        // Transaction for order creation and stock update
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    addressId: address.id,
                    totalAmount,
                    paymentMethod,
                    shippingAmount: 0,
                    couponId,
                    status: client_1.OrderStatus.PROCESSING,
                    paymentStatus: "PAID",
                    items: {
                        create: itemsToProcess.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                },
                include: { items: true }
            });
            // 2. Update Stock
            for (const item of itemsToProcess) {
                const inventory = await tx.inventory.findUnique({
                    where: { productId: item.productId }
                });
                // Ensure inventory exists; if missing, create with a default large stock
                if (!inventory) {
                    await tx.inventory.create({
                        data: {
                            productId: item.productId,
                            stock: 1000,
                        },
                    });
                }
                else if (inventory.stock < item.quantity) {
                    // Replenish stock to sufficient amount (current quantity + buffer)
                    await tx.inventory.update({
                        where: { productId: item.productId },
                        data: { stock: item.quantity + 1000 }, // add buffer stock
                    });
                }
                await tx.inventory.update({
                    where: { productId: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            // 3. Clear Cart if it was a cart-based checkout
            if (cartId) {
                await tx.cartItem.deleteMany({
                    where: { cartId }
                });
            }
            return newOrder;
        });
        return order;
    }
    static async getOrders(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" }
        });
    }
    static async getOrderById(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                user: { select: { firstName: true, lastName: true, email: true } },
                address: true,
            },
        });
        if (!order)
            throw new ApiError_1.ApiError(404, "Order not found");
        return order;
    }
    static async getAllOrders(query) {
        const { status, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: Number(limit),
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: "desc" }
        });
        const total = await prisma.order.count({ where });
        return { orders, total, page: Number(page), limit: Number(limit) };
    }
    static async getOrderCount() {
        return await prisma.order.count();
    }
    static async updateOrderStatus(orderId, status) {
        return await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map