import { NextRequest, NextResponse } from 'next/server';

// ✅ Environment Variables from Vercel Dashboard
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;  // Set this in Vercel
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_DC = process.env.MAILCHIMP_DC; // Example: 'us22'

// ✅ Helper to compute MD5 hash (Edge Runtime Compatible)
async function md5(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, phone, recaptchaToken } = await req.json();

  // ✅ Basic Validation
  if (!email || !firstName || !lastName || !phone || !recaptchaToken) {
    return NextResponse.json({ error: 'All fields and captcha are required' }, { status: 400 });
  }

  // ✅ Verify reCAPTCHA v3 Token with Google API
  const captchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
  });

  const captchaData = await captchaRes.json();

  if (!captchaData.success || captchaData.score < 0.5) {
    return NextResponse.json({ error: 'Captcha verification failed' }, { status: 403 });
  }

  // ✅ Subscribe User to Mailchimp List
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

  if (subscribeRes.status >= 400) {
    const errorData = await subscribeRes.json();
    return NextResponse.json({ error: errorData.detail || 'Failed to subscribe' }, { status: subscribeRes.status });
  }

  // ✅ Compute MD5 hash for Tagging
  const subscriberHash = await md5(email.toLowerCase());

  // ✅ Add Tag to Subscriber
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

  if (tagRes.status >= 400) {
    const errorData = await tagRes.json();
    return NextResponse.json({ error: errorData.detail || 'Failed to add tag' }, { status: tagRes.status });
  }

  // ✅ Success Response
  return NextResponse.json({ success: true, message: 'Successfully subscribed and tagged!' }, { status: 200 });

}
