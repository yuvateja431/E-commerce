import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const steps = ["Address", "Summary", "Payment", "Confirmation"];

export default function CheckoutStepper() {
  const currentStep = useSelector((state: RootState) => state.checkout.currentStep);

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <div className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                index < currentStep
                  ? "bg-indigo-600 text-white"
                  : index === currentStep
                  ? "bg-indigo-200 text-indigo-800"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 block text-sm font-medium">
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
