import { NextRequest, NextResponse } from 'next/server';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const RECAPTCHA_PROJECT_ID = 'gen-lang-client-0861323746';
const RECAPTCHA_SITE_KEY = '6LfDIpYrAAAAANH8N6nXoXOj_1IZNvtelhpH13Qp';

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, phone, recaptchaToken } = await req.json();

  if (!email || !firstName || !lastName || !phone || !recaptchaToken) {
    return NextResponse.json({ error: 'All fields and captcha are required' }, { status: 400 });
  }

  // Initialize reCAPTCHA Enterprise Client
  const client = new RecaptchaEnterpriseServiceClient();

  // Build Assessment Request
  const request = {
    assessment: {
      event: {
        token: recaptchaToken,
        siteKey: RECAPTCHA_SITE_KEY,
      },
    },
    parent: client.projectPath(RECAPTCHA_PROJECT_ID),
  };

  const [assessment] = await client.createAssessment(request);

  // Validate Token
  if (!assessment.tokenProperties.valid) {
    return NextResponse.json({ error: `Invalid reCAPTCHA token: ${assessment.tokenProperties.invalidReason}` }, { status: 400 });
  }

  // Risk Score Threshold
  const riskScore = assessment.riskAnalysis.score;
  if (riskScore < 0.5) {
    return NextResponse.json({ error: 'reCAPTCHA failed, suspicious activity detected' }, { status: 403 });
  }

  // ---- MAILCHIMP LOGIC ----
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const DC = process.env.MAILCHIMP_DC; // e.g., 'us22'

  const subscriberData = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      PHONE: phone
    }
  };

  const subscribeRes = await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`, {
    method: 'POST',
    headers: {
      'Authorization': `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscriberData)
  });

  if (subscribeRes.status >= 400) {
    const errorData = await subscribeRes.json();
    return NextResponse.json({ error: errorData.detail || 'Failed to subscribe' }, { status: subscribeRes.status });
  }

  // Compute MD5 hash using SubtleCrypto
  async function md5(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const subscriberHash = await md5(email.toLowerCase());

  // Add Tag
  const tagData = {
    tags: [
      {
        name: "Articles & Wellness insights Subscriber",
        status: "active"
      }
    ]
  };

  const tagRes = await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`, {
    method: 'POST',
    headers: {
      'Authorization': `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tagData)
  });

  if (tagRes.status >= 400) {
    const errorData = await tagRes.json();
    return NextResponse.json({ error: errorData.detail || 'Failed to add tag' }, { status: tagRes.status });
  }

  return NextResponse.json({ message: 'Successfully subscribed and tagged!' }, { status: 200 });
}
