import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ success: false, message: 'Reference is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    console.log('Paystack verification response:', data);

    if (data.data && data.data.status === 'success') {
      const userId = data.data.metadata?.userId;
      const plan = data.data.metadata?.plan;

      if (!userId) {
        console.error('User ID is missing in the metadata:', data.data.metadata);
        return NextResponse.json({ success: false, message: 'User ID is missing in the transaction metadata.' }, { status: 400 });
      }

      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            isSubscribed: true,
          },
        });

        console.log('User updated:', updatedUser);

        const newSubscription = await prisma.subscription.create({
          data: {
            userId,
            plan,
            status: 'active',
            startDate: new Date(),
            endDate: plan === 'monthly' ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        });

        console.log('Subscription created:', newSubscription);

        const responseHeaders = new Headers();
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        responseHeaders.set('Access-Control-Allow-Origin', '*'); // Change this to your client URL in production
        responseHeaders.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        responseHeaders.set(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );

        return new NextResponse(JSON.stringify({ success: true, message: 'Subscription updated successfully.' }), {
          status: 200,
          headers: responseHeaders,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json({ success: false, message: `Database update error: ${dbError.message}` }, { status: 500 });
      }
    } else {
      console.error('Verification failed:', data.message || data);
      return NextResponse.json({ success: false, message: 'Payment verification failed.' }, { status: 400 });
    }
  } catch (fetchError) {
    console.error('Error verifying transaction:', fetchError);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
};
