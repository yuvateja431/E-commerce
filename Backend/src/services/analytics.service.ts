import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AnalyticsService {
  static async getDashboardStats() {
    const totalRevenue = await prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true }
    });

    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count({ where: { role: "USER" } });
    const totalProducts = await prisma.product.count();

    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    });

    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          name: product?.name,
          sales: item._sum.quantity
        };
      })
    );

    // Sales by month (simplified)
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    const salesByMonth = recentOrders.reduce((acc: any, order) => {
      const month = order.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + order.totalAmount;
      return acc;
    }, {});

    const salesData = Object.keys(salesByMonth).map(month => ({
      month,
      revenue: salesByMonth[month]
    }));

    return {
      stats: {
        revenue: totalRevenue._sum.totalAmount || 0,
        orders: totalOrders,
        customers: totalCustomers,
        products: totalProducts
      },
      topProducts: topProductsDetails,
      salesData
    };
  }
}
