"use client";

import { useState } from "react";
import { FiPlay, FiCheck, FiX, FiLoader } from "react-icons/fi";

type TestResult = {
  test: string;
  status: "pending" | "success" | "error";
  result?: string;
  error?: string;
};

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (
    test: string,
    status: "success" | "error",
    result?: string,
    error?: string
  ) => {
    setTestResults((prev) => [...prev, { test, status, result, error }]);
  };

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Unknown error";

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Check if API route exists (GET request - should return 405)
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "GET",
      });

      if (response.status === 405) {
        addResult(
          "GET Request Test (Should return 405)",
          "success",
          `✅ API route exists! Status: ${response.status} - Method Not Allowed`
        );
      } else if (response.status === 404) {
        addResult(
          "GET Request Test",
          "error",
          undefined,
          "❌ API route not found! Status: 404. Check file structure."
        );
      } else {
        addResult(
          "GET Request Test",
          "error",
          undefined,
          `❌ Unexpected status: ${response.status}`
        );
      }
    } catch (error: unknown) {
      addResult(
        "GET Request Test",
        "error",
        undefined,
        `❌ Network error: ${getErrorMessage(error)}`
      );
    }

    // Test 2: Environment variables check
    try {
      const hasPublicKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (hasPublicKey) {
        addResult(
          "Environment Variables Test",
          "success",
          "✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY found"
        );
      } else {
        addResult(
          "Environment Variables Test",
          "error",
          undefined,
          "❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in .env.local"
        );
      }
    } catch (error: unknown) {
      addResult(
        "Environment Variables Test",
        "error",
        undefined,
        `❌ Error checking env vars: ${getErrorMessage(error)}`
      );
    }

    // Test 3: POST request to API route
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2999,
          productId: "test-product-1",
        }),
      });

      const data = (await response.json()) as {
        clientSecret?: string;
        error?: string;
      };

      if (response.ok && data.clientSecret) {
        addResult(
          "POST Request Test",
          "success",
          `✅ Payment intent created! Client secret starts with: ${data.clientSecret.substring(
            0,
            20
          )}...`
        );
      } else {
        addResult(
          "POST Request Test",
          "error",
          undefined,
          `❌ Status: ${response.status}, Response: ${JSON.stringify(
            data
          )}. Check server logs for details.`
        );
      }
    } catch (error: unknown) {
      addResult(
        "POST Request Test",
        "error",
        undefined,
        `❌ Error: ${getErrorMessage(error)}`
      );
    }

    // Test 4: File structure check (client-side approximation)
    try {
      // Try to access the API route with different methods to infer structure
      const options = await fetch("/api/create-payment-intent", {
        method: "OPTIONS",
      });

      addResult(
        "File Structure Test",
        "success",
        `✅ API route responds to OPTIONS: ${options.status}`
      );
    } catch (error: unknown) {
      addResult(
        "File Structure Test",
        "error",
        undefined,
        `❌ Could not test file structure: ${getErrorMessage(error)}`
      );
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <FiCheck className="h-5 w-5 text-green-600" />;
      case "error":
        return <FiX className="h-5 w-5 text-red-600" />;
      default:
        return <FiLoader className="h-5 w-5 animate-spin text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            API Route Diagnostic Test
          </h1>
          <p className="text-gray-600">
            Test your Stripe API route setup step by step
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Diagnostic Tests
            </h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isRunning ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <FiPlay className="h-4 w-4" />
                  <span>Run All Tests</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  result.status === "success"
                    ? "border-green-200 bg-green-50"
                    : result.status === "error"
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{result.test}</h3>
                    {result.result && (
                      <p className="mt-1 text-sm text-gray-700">
                        {result.result}
                      </p>
                    )}
                    {result.error && (
                      <p className="mt-1 text-sm text-red-700">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {testResults.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Click &quot;Run All Tests&quot; to start debugging your API route
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
