import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

const LS_KEY = "guest_wishlist";

// ── localStorage helpers (guest users) ──────────────────────────────────────
export const loadGuestWishlist = (): string[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (ids: string[]) => {
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
};

const clearGuestWishlist = () => {
  localStorage.removeItem(LS_KEY);
};

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/wishlist");
      return res.data.data; // { id, userId, items: [{ id, productId, product }] }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string, { rejectWithValue }) => {
    try {
      await api.post("/wishlist/add", { productId });
      const res = await api.get("/wishlist");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      const res = await api.get("/wishlist");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to remove from wishlist");
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId: string, { getState, dispatch }: any) => {
    const state = getState();
    const items: any[] = state.wishlist.wishlist?.items ?? [];
    const isInWishlist = items.some((item: any) => item.productId === productId);
    if (isInWishlist) {
      return dispatch(removeFromWishlist(productId));
    } else {
      return dispatch(addToWishlist(productId));
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

interface WishlistState {
  wishlist: { items: any[] };
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: { items: [] },
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistState(state) {
      state.wishlist = { items: [] };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: WishlistState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (state: WishlistState, action: any) => {
      state.loading = false;
      if (action.payload && typeof action.payload === "object" && "items" in action.payload) {
        state.wishlist = action.payload;
      }
    };
    const handleRejected = (state: WishlistState, action: any) => {
      state.loading = false;
      state.error = action.payload ?? "Something went wrong";
    };

    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected)
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.rejected, handleRejected)
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.rejected, handleRejected);
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
