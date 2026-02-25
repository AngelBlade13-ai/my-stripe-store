"use client";

import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FiCreditCard, FiX, FiLoader } from "react-icons/fi";

type Product = {
  id: string;
  price: number;
};

const PaymentForm: React.FC<{
  product: Product;
  onSuccess: () => void;
}> = ({ product, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: product.price,
          productId: product.id,
        }),
      });

      const data = (await response.json()) as {
        clientSecret?: string;
        error?: string;
      };

      if (!response.ok || !data.clientSecret) {
        setError(data.error ?? "Failed to create payment intent");
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
      } else {
        onSuccess();
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-gray-50 p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div className="rounded-md border border-gray-300 bg-white p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-600">
          <FiX className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isProcessing ? (
          <>
            <FiLoader className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FiCreditCard className="h-5 w-5" />
            <span>Pay ${(product.price / 100).toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
