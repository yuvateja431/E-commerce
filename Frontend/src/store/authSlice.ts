import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

export const logoutAsync = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    dispatch(logout());
  }
});

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const safeJSONParse = (item: string | null) => {
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

const initialState: AuthState = {
  user: safeJSONParse(localStorage.getItem("user")),
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setLoading, setAuth, logout, setError, updateUser } = authSlice.actions;
export default authSlice.reducer;
