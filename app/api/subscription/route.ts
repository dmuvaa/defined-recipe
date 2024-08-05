import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json();
  const amount = plan === 'monthly' ? 499 * 100 : 3999 * 100;
  const reference = `sub_${session.user.id}_${Date.now()}`;

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/webhook`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize transaction');
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error: any) {
    console.error('Error initializing transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
