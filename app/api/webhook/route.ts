import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      // Handle the event
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
        }
      }
    } else {
      return res.status(400).send('Invalid signature');
    }

    res.status(200).send('Webhook received');
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
