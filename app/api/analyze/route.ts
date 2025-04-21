import { NextResponse } from "next/server";

/**
 * This API route forwards the request to the Flask backend for analysis.
 */
export async function POST(request: Request) {
  try {
    const { text, subject } = await request.json();

    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Forward the request to the Flask backend
    const flaskResponse = await fetch(
      "https://phisher-ai.onrender.com/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, subject }),
      }
    );

    // Handle Flask backend response
    if (!flaskResponse.ok) {
      const errorResponse = await flaskResponse.json();
      return NextResponse.json(
        { error: errorResponse.error || "Error from backend" },
        { status: flaskResponse.status }
      );
    }

    const result = await flaskResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
