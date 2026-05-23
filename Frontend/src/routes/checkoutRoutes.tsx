// src/routes/checkoutRoutes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import AddressStep from "../components/checkout/AddressStep";
import SummaryStep from "../components/checkout/SummaryStep";
import PaymentStep from "../components/checkout/PaymentStep";
import SuccessPage from "../components/checkout/SuccessPage";

const CheckoutRoutes: React.FC = () => (
  <Routes>
    <Route path="/checkout/address" element={<AddressStep />} />
    <Route path="/checkout/summary" element={<SummaryStep />} />
    <Route path="/checkout/payment" element={<PaymentStep />} />
    <Route path="/checkout/success" element={<SuccessPage />} />
  </Routes>
);

export default CheckoutRoutes;
