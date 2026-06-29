import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Server-side validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // In a real application, you would send this to Resend, SendGrid, etc.
    console.log("Contact Form Submission received:", { name, email, subject, message });

    // Return response with rate limit headers placeholder
    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "99",
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
