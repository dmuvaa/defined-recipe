// src/app/api/initialize-transaction/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { plan } = req.body;
  const amount = plan === 'monthly' ? 499 * 100 : 3999 * 100;

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: session.user.email,
      amount,
      metadata: {
        userId: session.user.id,
        plan,
      },
      callback_url: `${process.env.NEXTAUTH_URL}/api/webhook`,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return res.status(200).json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    return res.status(500).json({ error: 'Error initializing payment' });
  }
}
