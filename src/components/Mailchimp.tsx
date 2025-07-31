import { NextResponse } from "next/server";
import mailchimp from "@mailchimp/mailchimp_marketing";

// Initialize Mailchimp Config
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // Example: 'us21'
});

// reCAPTCHA Secret Key
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, phone, recaptchaToken } = await req.json();

    // Validate Inputs
    if (!email || !firstName || !lastName || !phone || !recaptchaToken) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    // --- Verify reCAPTCHA ---
    const captchaVerifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
    });

    const captchaData = await captchaVerifyRes.json();

    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json({ success: false, error: "reCAPTCHA verification failed." }, { status: 400 });
    }

    // --- Add to Mailchimp List ---
    const subscribeResponse = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID as string,
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      }
    );

    // --- Add Tags to Subscriber ---
    await mailchimp.lists.updateListMemberTags(
      process.env.MAILCHIMP_AUDIENCE_ID as string,
      subscribeResponse.id,
      {
        tags: [
          { name: "Website Signup", status: "active" },
          { name: "New Subscriber", status: "active" },
        ],
      }
    );

    return NextResponse.json({ success: true, message: "Successfully subscribed!" }, { status: 200 });

  } catch (error: any) {
    console.error("Mailchimp API Error:", error);

    // Handle "Member Exists" Error Gracefully
    if (error.status === 400 && error.response?.body?.title === "Member Exists") {
      return NextResponse.json({ success: true, message: "You're already subscribed." }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: error.message || "Subscription failed." }, { status: 500 });
  }
}
