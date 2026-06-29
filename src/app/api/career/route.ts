import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, linkedin, github, message, cvFile } = body;

    // Server-side validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
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

    console.log("Job Application received:", { name, email, linkedin, github, message, cvFileName: cvFile?.name });

    return NextResponse.json(
      { success: true, message: "Application submitted successfully" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "19",
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
