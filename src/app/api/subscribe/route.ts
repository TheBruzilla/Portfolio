import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, phone } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const DC = process.env.MAILCHIMP_DC; // Example: 'us22'

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

  // Step 2: Add Tag to the User
  const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

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
