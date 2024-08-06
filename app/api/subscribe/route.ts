import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, plan, startDate, endDate } = await req.json();

    if (!userId || !plan || !startDate || !endDate) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        startDate,
        endDate,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { isSubscribed: true },
    });

    return NextResponse.json(subscription, { status: 200 });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error.message || 'Error creating subscription' }, { status: 500 });
  }
}

export function GET(req: NextRequest) {
  return new NextResponse(`Method ${req.method} Not Allowed`, {
    status: 405,
    headers: {
      'Allow': 'POST',
    },
  });
}
