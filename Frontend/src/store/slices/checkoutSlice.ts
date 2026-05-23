import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export type PaymentMethod = "CARD" | "UPI" | "COD" | "STRIPE" | "RAZORPAY";

export interface CheckoutState {
  currentStep: number; // 0: address, 1: summary, 2: payment, 3: confirmation
  selectedAddressId: string | null;
  appliedCoupon: { code: string; discountAmount: number } | null;
  selectedPaymentMethod: PaymentMethod;
  orderId: string | null;
  paymentResult: {
    status: "PENDING" | "PAID" | "FAILED";
    transactionId?: string;
    gatewayResponse?: any;
  } | null;
  confirmedOrder: any | null; // will hold full order data after confirmation
  loading: boolean;
  instantOrder: { productId: string; variantId: string | null; quantity: number } | null;
}

const initialState: CheckoutState = {
  currentStep: 0,
  selectedAddressId: null,
  appliedCoupon: null,
  selectedPaymentMethod: "CARD",
  orderId: null,
  paymentResult: null,
  confirmedOrder: null,
  loading: false,
  instantOrder: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    setAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload;
    },
    setCoupon(state, action: PayloadAction<{ code: string; discountAmount: number } | null>) {
      state.appliedCoupon = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.selectedPaymentMethod = action.payload;
    },
    setOrderId(state, action: PayloadAction<string>) {
      state.orderId = action.payload;
    },
    setPaymentResult(state, action: PayloadAction<CheckoutState["paymentResult"]>) {
      state.paymentResult = action.payload;
    },
    setConfirmedOrder(state, action: PayloadAction<any>) {
      state.confirmedOrder = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setInstantOrder(state, action: PayloadAction<{ productId: string; variantId: string | null; quantity: number }>) {
      state.instantOrder = action.payload;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setStep,
  setAddress,
  setCoupon,
  setPaymentMethod,
  setOrderId,
  setPaymentResult,
  setConfirmedOrder,
  setLoading,
  setInstantOrder,
  reset,
} = checkoutSlice.actions;

export const selectCheckout = (state: RootState) => state.checkout;

export default checkoutSlice.reducer;

