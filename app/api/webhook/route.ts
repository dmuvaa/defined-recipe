import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';

  // Retrieve the raw body as a string to validate the Paystack signature
  const text = await req.text();

  const hash = crypto
    .createHmac('sha512', secret)
    .update(text)
    .digest('hex');

  if (hash !== req.headers.get('x-paystack-signature')) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(text);

  if (event.event === 'charge.success') {
    const { email } = event.data.customer;
    const plan = event.data.metadata.plan;
    const startDate = new Date(event.data.paid_at).toISOString();
    const endDate = new Date(
      new Date(event.data.paid_at).setFullYear(
        new Date(event.data.paid_at).getFullYear() + (plan === 'monthly' ? 0 : 1)
      )
    ).toISOString();

    try {
      const user = await prisma.user.update({
        where: { email },
        data: { isSubscribed: true },
      });

      // Save the subscription to the database
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan,
          status: 'active',
          startDate,
          endDate,
        },
        create: {
          userId: user.id,
          plan,
          status: 'active',
          startDate,
          endDate,
        },
      });

      console.log(`Subscription updated for user: ${user.email}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return NextResponse.json({ error: 'Error updating subscription' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

// Optional: Handle unsupported HTTP methods
export function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
