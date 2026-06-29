import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, name, email, sector, message } = body;

    // Server-side validation
    if (!company || !name || !email || !sector) {
      return NextResponse.json(
        { success: false, error: "Company, name, email, and sector are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    console.log("B2B Audit Request received:", { company, name, email, sector, message });

    return NextResponse.json(
      { success: true, message: "Audit request received" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "50",
          "X-RateLimit-Remaining": "49",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
