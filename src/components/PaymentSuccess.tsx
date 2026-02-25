import React from "react";
import { FiCheck } from "react-icons/fi";

const PaymentSuccess: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="space-y-6 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
      <FiCheck className="h-8 w-8 text-green-600" />
    </div>
    <div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Payment Successful!
      </h3>
      <p className="text-gray-600">
        Thank you for your purchase. You&apos;ll receive a confirmation email
        shortly.
      </p>
    </div>
    <button
      onClick={onReset}
      className="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
    >
      Make Another Purchase
    </button>
  </div>
);

export default PaymentSuccess;
