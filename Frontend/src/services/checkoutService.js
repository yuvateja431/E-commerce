import api from "./api";

/** ADDRESS ENDPOINTS */
export const fetchAddresses = () => api.get(`/addresses`);
export const createAddress = (data) => api.post(`/addresses`, data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
export const setDefaultAddress = (id) => api.patch(`/addresses/${id}/default`);

/** ORDER ENDPOINTS */
export const fetchOrder = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

/** CHECKOUT ENDPOINT */
export const startCheckout = (payload) => api.post(`/orders/checkout`, payload);

/** PAYMENT GATEWAY ENDPOINTS */
export const createStripeIntent = (amount, currency = "INR") => api.post(`/payments/stripe-intent`, { amount, currency });
export const createRazorpayOrder = (amount, currency = "INR") => api.post(`/payments/razorpay-order`, { amount, currency });
export const verifyPayment = async (payload) => {
    const response = await api.post(`/payments/verify`, payload);
    return response.data;
};
