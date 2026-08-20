import { PrismaClient, OrderStatus } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { CartService } from "./cart.service.js";
const prisma = new PrismaClient();
export class OrderService {
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
                throw new ApiError(404, "Product not found");
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
            const cart = await CartService.getCart(userId);
            if (!cart.items || cart.items.length === 0) {
                throw new ApiError(400, "Cart is empty");
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
                    throw new ApiError(400, `Minimum order value for this coupon is ${coupon.minOrderAmount}`);
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
            throw new ApiError(404, "User not found");
        // Check if user already has an address matching this street & postal code
        const userAddresses = await prisma.address.findMany({ where: { userId } });
        const normStreet = (shippingAddress.street || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const normZip = (shippingAddress.zipCode || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const normCity = (shippingAddress.city || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        let address = userAddresses.find((a) => {
            const aStreet = (a.addressLine1 || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const aZip = (a.postalCode || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const aCity = (a.city || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            return ((aStreet === normStreet && aZip === normZip) ||
                (aStreet.includes(normStreet) && aZip === normZip && aCity === normCity));
        });
        if (!address) {
            const isFirst = userAddresses.length === 0;
            address = await prisma.address.create({
                data: {
                    userId,
                    fullName: user.firstName + " " + user.lastName,
                    phone: "0000000000",
                    addressLine1: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.zipCode,
                    country: shippingAddress.country,
                    addressType: "HOME",
                    isDefault: isFirst,
                },
            });
        }
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
                    status: OrderStatus.PROCESSING,
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
            return await tx.order.findUnique({
                where: { id: newOrder.id },
                include: {
                    items: { include: { product: true } },
                    address: true,
                    user: { select: { firstName: true, lastName: true, email: true } }
                }
            });
        });
        return order;
    }
    static async getOrders(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
                address: true,
                user: { select: { firstName: true, lastName: true, email: true } }
            },
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
            throw new ApiError(404, "Order not found");
        return order;
    }
    static async getAllOrders(query = {}) {
        const { status, page = 1, limit } = query;
        const limitNum = limit === 'all' ? 1000 : (Number(limit) || 1000);
        const pageNum = Number(page) || 1;
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status && status !== 'ALL')
            where.status = status;
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: limitNum,
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                address: true,
                items: { include: { product: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        const total = await prisma.order.count({ where });
        return { orders, total, page: pageNum, limit: limitNum };
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
