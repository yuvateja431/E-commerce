import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CheckoutStepper from "../../components/checkout/CheckoutStepper";
import AddressStep from "../../components/checkout/AddressStep";
import OrderSummaryStep from "../../components/checkout/OrderSummaryStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import OrderConfirmationStep from "../../components/checkout/OrderConfirmationStep";

export default function CheckoutPage() {
  const currentStep = useSelector((state: RootState) => state.checkout.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AddressStep />;
      case 1:
        return <OrderSummaryStep />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <OrderConfirmationStep />;
      default:
        return <AddressStep />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <CheckoutStepper />
      {renderStep()}
    </div>
  );
}
