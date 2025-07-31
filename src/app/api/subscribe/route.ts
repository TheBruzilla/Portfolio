import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, phone } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const DC = process.env.MAILCHIMP_DC; // e.g., 'us22'

  // Step 1: Subscribe the user
  const subscriberData = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName || '',
      LNAME: lastName || '',
      PHONE: phone || ''
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

  // ✅ Step 2: Compute MD5 hash using SubtleCrypto (Edge Runtime friendly)
  async function md5(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const subscriberHash = await md5(email.toLowerCase());

  // Step 3: Add Tag to the User
  const tagData = {
    tags: [
      {
        name: "Newsletter Subscriber",
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
