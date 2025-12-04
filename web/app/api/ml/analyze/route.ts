import { NextResponse } from "next/server";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward request to ML backend
    const response = await fetch(`${ML_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ML API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to ML API:", error);
    return NextResponse.json(
      { 
        error: "Failed to connect to ML backend",
        message: error instanceof Error ? error.message : String(error),
        hint: "Make sure the backend server is running: cd backend && python main.py --api"
      },
      { status: 503 }
    );
  }
}

