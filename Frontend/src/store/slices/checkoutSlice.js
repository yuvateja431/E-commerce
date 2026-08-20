import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        setStep(state, action) {
            state.currentStep = action.payload;
        },
        setAddress(state, action) {
            state.selectedAddressId = action.payload;
        },
        setCoupon(state, action) {
            state.appliedCoupon = action.payload;
        },
        setPaymentMethod(state, action) {
            state.selectedPaymentMethod = action.payload;
        },
        setOrderId(state, action) {
            state.orderId = action.payload;
        },
        setPaymentResult(state, action) {
            state.paymentResult = action.payload;
        },
        setConfirmedOrder(state, action) {
            state.confirmedOrder = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setInstantOrder(state, action) {
            state.instantOrder = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    },
});
export const { setStep, setAddress, setCoupon, setPaymentMethod, setOrderId, setPaymentResult, setConfirmedOrder, setLoading, setInstantOrder, reset, } = checkoutSlice.actions;
export const selectCheckout = (state) => state.checkout;
export default checkoutSlice.reducer;
