import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { prisma } from '../../lib/prisma';
import Paystack from 'paystack-node';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

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
    const response = await paystack.transaction.initialize({
      email: session.user.email,
      amount,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/webhook`,
    });

    return NextResponse.json({ authorization_url: response.data.authorization_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
