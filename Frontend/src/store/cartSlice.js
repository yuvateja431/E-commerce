import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
    const res = await api.get("/cart");
    return res.data.data;
});
export const addItem = createAsyncThunk("cart/addItem", async (data) => {
    const res = await api.post("/cart/add", data);
    return res.data.data;
});
export const updateItem = createAsyncThunk("cart/updateItem", async (data) => {
    const res = await api.put("/cart/update", data);
    return res.data.data;
});
export const removeItem = createAsyncThunk("cart/removeItem", async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data.data; // returns full updated cart
});
export const clearCart = createAsyncThunk("cart/clear", async () => {
    const res = await api.delete("/cart/clear");
    return res.data.data; // returns empty cart
});
const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: { items: [] }, loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
        })
            .addCase(addItem.fulfilled, (state, action) => {
            if (action.payload)
                state.cart = action.payload;
            state.loading = false;
        })
            .addCase(updateItem.fulfilled, (state, action) => {
            if (action.payload)
                state.cart = action.payload;
            state.loading = false;
        })
            .addCase(removeItem.fulfilled, (state, action) => {
            // payload is the updated cart from the backend (items already removed)
            if (action.payload && typeof action.payload === "object") {
                state.cart = action.payload;
            }
            state.loading = false;
        })
            .addCase(clearCart.fulfilled, (state, action) => {
            // payload is the empty cart returned by backend
            if (action.payload && typeof action.payload === "object") {
                state.cart = action.payload;
            }
            else {
                state.cart = { items: [] };
            }
            state.loading = false;
        })
            // Any rejected action (e.g. 401) — just stop loading, keep existing state
            .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"), (state) => {
            state.loading = false;
        });
    }
});
export default cartSlice.reducer;
