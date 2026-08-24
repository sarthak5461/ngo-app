import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";

export async function GET() {
  try {
    const result = await sendEmail({
      to: "sarthaksahu30@gmail.com",
      subject: "MKDS Email Test",
      html: `
        <h2>Email system is working</h2>
        <p>This is a test email from the Maa Karma Devi Sangh Trust application.</p>
        <p>If you received this message, the Resend integration is working correctly.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
