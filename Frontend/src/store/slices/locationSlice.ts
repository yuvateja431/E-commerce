import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export interface DeliveryLocation {
  city: string;
  pincode: string;
  stateName?: string;
  addressLine?: string;
  isCustom?: boolean;
  addressId?: string;
}

interface LocationState {
  currentLocation: DeliveryLocation;
}

export const DEFAULT_LOCATION: DeliveryLocation = {
  city: "Hyderabad",
  pincode: "500034",
  stateName: "Telangana",
  addressLine: "",
  isCustom: false,
};

const safeJSONParse = (item: string | null): DeliveryLocation | null => {
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

const initialLocation = safeJSONParse(localStorage.getItem("delivery_location")) || DEFAULT_LOCATION;

const initialState: LocationState = {
  currentLocation: initialLocation,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<DeliveryLocation>) {
      state.currentLocation = {
        ...action.payload,
        city: action.payload.city || "Hyderabad",
        pincode: action.payload.pincode || "500034",
      };
      localStorage.setItem("delivery_location", JSON.stringify(state.currentLocation));
    },
    resetLocation(state) {
      state.currentLocation = DEFAULT_LOCATION;
      localStorage.setItem("delivery_location", JSON.stringify(DEFAULT_LOCATION));
    },
  },
});

export const { setLocation, resetLocation } = locationSlice.actions;
export const selectLocation = (state: RootState) => state.location?.currentLocation || DEFAULT_LOCATION;
export default locationSlice.reducer;
