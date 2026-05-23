export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type PaymentMethod = "CARD" | "UPI" | "COD" | "STRIPE" | "RAZORPAY";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  shippingAmount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
}
