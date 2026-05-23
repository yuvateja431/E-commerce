import api from "./api";

// Base URL for the backend API – adjust if needed (e.g., proxy in Vite)
const API_BASE = "";

/** ADDRESS ENDPOINTS */
export const fetchAddresses = () => api.get(`/addresses`);
export const createAddress = (data: any) => api.post(`/addresses`, data);
export const updateAddress = (id: string, data: any) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id: string) => api.delete(`/addresses/${id}`);
export const setDefaultAddress = (id: string) =>
  api.patch(`/addresses/${id}/default`);

/** ORDER ENDPOINTS */
export const fetchOrder = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch order");
  }
  return response.json(); // expected order object
};

/** CHECKOUT ENDPOINT */
export const startCheckout = (payload: any) =>
  api.post(`/orders/checkout`, payload);

/** PAYMENT GATEWAY ENDPOINTS */
export const createStripeIntent = (amount: number, currency: string = "INR") =>
  api.post(`/payments/stripe-intent`, { amount, currency });

export const createRazorpayOrder = (amount: number, currency: string = "INR") =>
  api.post(`/payments/razorpay-order`, { amount, currency });

export const verifyPayment = async (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  const response = await fetch(`/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Payment verification failed");
  }
  return response.json(); // { status: "PAID" }
};
