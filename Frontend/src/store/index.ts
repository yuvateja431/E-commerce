import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "./slices/checkoutSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
