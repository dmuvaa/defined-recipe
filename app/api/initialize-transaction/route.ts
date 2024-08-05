import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const { email, amount } = await req.json();
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
    }),
  });

  const data = await response.json();

  if (data.status) {
    return NextResponse.json(data.data); // Success: return the initialization data
  } else {
    return NextResponse.json({ error: 'Failed to initialize transaction' }, { status: 500 });
  }
}
