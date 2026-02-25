"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FiShoppingCart } from "react-icons/fi";
import PaymentSuccess from "@/components/PaymentSuccess";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const product = {
  id: "prod_premium_coffee_01",
  name: "Celestial Coffee Blend",
  description:
    "A rich, aromatic blend of hand-picked beans from the high mountains of Colombia.",
  price: 2999,
  image:
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
};

export default function HomePage() {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleBuyNow = async () => {
    setShowPayment(true);
  };

  const handleReset = () => {
    setShowPayment(false);
    setPaymentSuccess(false);
  };

  if (paymentSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <PaymentSuccess onReset={handleReset} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {!showPayment ? (
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover md:h-full"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found";
                  }}
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:w-1/2">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="mb-6 text-gray-600">{product.description}</p>
                <div className="mb-8 flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="flex w-full transform items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 text-lg font-bold text-white transition-transform hover:scale-105 hover:bg-blue-700"
                >
                  <FiShoppingCart className="h-6 w-6" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-6 flex items-center space-x-4 border-b pb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover shadow-md"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/80x80/e2e8f0/64748b?text=Img";
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  product={product}
                  onSuccess={() => setPaymentSuccess(true)}
                />
              </Elements>

              <button
                onClick={() => setShowPayment(false)}
                className="mt-6 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Use the following test card:</p>
          <p className="text-xs font-mono text-gray-600">
            Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: 123
          </p>
        </div>
      </div>
    </div>
  );
}
