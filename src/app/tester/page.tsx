"use client";

import { useState } from "react";

export default function TesterPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult(null); // Clear previous results
    try {
      const response = await fetch("/api/tester");
      if (response.ok) {
        const data = await response.json();
        setResult(`Success: ${JSON.stringify(data)}`);
      } else {
        setResult(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown fetch error";
      setResult(`Fetch Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center p-8">
      <h1 className="mb-6 text-center text-3xl font-bold">API Route Tester</h1>
      <p className="mb-6 text-center text-gray-600">
        Click this button to send a request from this page (the client) to your
        new API route (the server).
      </p>
      <button
        onClick={testApi}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test /api/tester"}
      </button>
      {result && (
        <div className="mt-8 w-full max-w-2xl rounded-lg bg-gray-100 p-6 shadow-inner">
          <h2 className="mb-2 text-xl font-semibold">Result:</h2>
          <pre className="break-words whitespace-pre-wrap rounded-md bg-gray-800 p-4 text-sm text-green-400">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
