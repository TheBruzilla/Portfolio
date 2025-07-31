export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_DC = process.env.MAILCHIMP_DC;

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, phone, recaptchaToken } = await req.json();
    console.log("Incoming Data:", { email, firstName, lastName, phone, recaptchaToken });

    if (!email || !firstName || !lastName || !phone || !recaptchaToken) {
      console.error("Missing Fields", { email, firstName, lastName, phone, recaptchaToken });
      return NextResponse.json({ error: 'All fields and captcha are required' }, { status: 400 });
    }

    // Verify reCAPTCHA
    const captchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });

    const captchaData = await captchaRes.json();
    console.log("Captcha Verification Result:", captchaData);

    if (!captchaData.success || captchaData.score < 0.5) {
      console.error("reCAPTCHA Failed", captchaData);
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 403 });
    }

    // Subscribe to Mailchimp List
    const subscriberData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: phone
      }
    };

    const subscribeRes = await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/`, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriberData)
    });

    const subscribeData = await subscribeRes.json();
    console.log("Mailchimp Subscribe Response:", subscribeRes.status, subscribeData);

    if (subscribeRes.status >= 400 && subscribeData.title !== "Member Exists") {
      console.error("Failed to Subscribe", subscribeData);
      return NextResponse.json({ error: subscribeData.detail || 'Failed to subscribe' }, { status: subscribeRes.status });
    }

    // Compute Subscriber Hash using Node.js Crypto
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    // Add Tags to Subscriber
    const tagData = {
      tags: [
        {
          name: "Articles & Wellness insights Subscriber",
          status: "active"
        }
      ]
    };

    const tagRes = await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagData)
    });

    const tagResponseData = await tagRes.json();
    console.log("Mailchimp Tag Response:", tagRes.status, tagResponseData);

    if (tagRes.status >= 400) {
      console.error("Failed to Add Tag", tagResponseData);
      return NextResponse.json({ error: tagResponseData.detail || 'Failed to add tag' }, { status: tagRes.status });
    }

    console.log("Successfully Subscribed and Tagged!");
    return NextResponse.json({ success: true, message: 'Successfully subscribed and tagged!' }, { status: 200 });

  } catch (error: any) {
    console.error("Unexpected API Error:", error);
    return NextResponse.json({ error: error.message || 'Unexpected server error' }, { status: 500 });
  }
}
