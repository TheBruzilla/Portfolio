import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const DC = process.env.MAILCHIMP_DC; // Data Center (like 'us22')

  if (!API_KEY || !AUDIENCE_ID || !DC) {
    return NextResponse.json({ error: 'Missing Mailchimp environment variables' }, { status: 500 });
  }

  const data = {
    email_address: email,
    status: 'subscribed'
  };

  const response = await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (response.status >= 400) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.detail || 'Failed to subscribe user' }, { status: response.status });
  }

  return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 200 });
}
