import type { Product, Category, Order, User, Coupon } from '../types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Elite Compute', slug: 'elite-compute', description: 'High-performance workstations and servers.', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', status: 'Active', productCount: 12 },
  { id: '2', name: 'Mobile Intelligence', slug: 'mobile-intelligence', description: 'Flagship mobile devices and communicators.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', status: 'Active', productCount: 8 },
  { id: '3', name: 'Optics & Vision', slug: 'optics-vision', description: 'Advanced imaging and monitoring systems.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', status: 'Active', productCount: 5 },
  { id: '4', name: 'Cybernetic Lifestyle', slug: 'cybernetic-lifestyle', description: 'Integrated lifestyle assets and wearable tech.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', status: 'Active', productCount: 15 },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Alexander Pierce', email: 'alexander@elite.com', phone: '+1 (555) 123-4567', role: 'Admin', status: 'Active', registrationDate: '2024-01-15', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
  { id: '2', name: 'Sarah Vance', email: 'sarah@vanguard.io', phone: '+1 (555) 987-6543', role: 'Manager', status: 'Active', registrationDate: '2024-02-20', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: '3', name: 'Marcus Miller', email: 'marcus@citizen.net', phone: '+1 (555) 456-7890', role: 'Customer', status: 'Active', registrationDate: '2024-03-05', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
  { id: '4', name: 'Elena Rossi', email: 'elena@nexus.com', phone: '+1 (555) 321-7654', role: 'Customer', status: 'Inactive', registrationDate: '2024-03-12', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
];

export const mockCoupons: Coupon[] = [
  { id: '1', code: 'VANGUARD25', description: '25% off for early adopters', discountType: 'Percentage', discountValue: 25, minOrderAmount: 500, startDate: '2024-05-01', expiryDate: '2024-12-31', usageLimit: 100, usedCount: 42, status: 'Active' },
  { id: '2', code: 'ELITE100', description: '$100 fixed discount for elite members', discountType: 'Fixed', discountValue: 100, minOrderAmount: 1000, startDate: '2024-06-01', expiryDate: '2024-09-30', usageLimit: 50, usedCount: 12, status: 'Active' },
];

export const mockAnalytics = {
  totalRevenue: 128493,
  totalOrders: 4821,
  totalProducts: 156,
  totalCustomers: 92104,
  lowStockProducts: 8,
  activeCoupons: 5,
  salesOverview: [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ],
  ordersByStatus: [
    { name: 'Delivered', value: 3200 },
    { name: 'Processing', value: 800 },
    { name: 'Shipped', value: 500 },
    { name: 'Cancelled', value: 321 },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 11000 },
    { month: 'Apr', revenue: 18000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 19000 },
  ],
  topProducts: [
    { name: 'Elite Workstation X1', sales: 450 },
    { name: 'Vanguard Mobile Pro', sales: 380 },
    { name: 'Nexus Optics Lens', sales: 310 },
    { name: 'CyberWatch Gen 4', sales: 290 },
  ]
};
