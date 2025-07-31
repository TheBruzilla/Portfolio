import { NextResponse } from "next/server";
import Mailchimp from "@mailchimp/mailchimp_marketing";

// Configure Mailchimp
Mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX  // e.g., 'us21'
});

// reCAPTCHA Secret Key
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, phone, recaptchaToken } = await req.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !recaptchaToken) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    // 1. Verify reCAPTCHA Token
    const captchaVerifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`
    });

    const captchaData = await captchaVerifyRes.json();

    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json({ success: false, error: "reCAPTCHA verification failed." }, { status: 400 });
    }

    // 2. Add Subscriber to Mailchimp List
    const subscribeResponse = await Mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID as string, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: phone
      }
    });

    // 3. Add Tags to the Contact
    await Mailchimp.lists.updateListMemberTags(process.env.MAILCHIMP_AUDIENCE_ID as string, subscribeResponse.id, {
      tags: [
        { name: "Website Signup", status: "active" },
        { name: "New Subscriber", status: "active" }
      ]
    });

    return NextResponse.json({ success: true, message: "Successfully subscribed!" }, { status: 200 });

  } catch (error: any) {
    console.error("Mailchimp API Error:", error);

    // Handle "Member Exists" case gracefully
    if (error.status === 400 && error.response?.body?.title === "Member Exists") {
      return NextResponse.json({ success: true, message: "You're already subscribed." }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: error.message || "Subscription failed." }, { status: 500 });
  }
}
