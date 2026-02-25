import { NextResponse } from "next/server";

export async function GET() {
  // This is where our secure, server-side logic will go.
  // For now, we'll just return a simple success message.
  return NextResponse.json({ message: "Success! Your API route is working." });
}
