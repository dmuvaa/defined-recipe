// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '../../lib/prisma';

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const { userId, plan, startDate, endDate } = req.body;

//   try {
//     const subscription = await prisma.subscription.create({
//       data: {
//         userId,
//         plan,
//         status: 'active',
//         startDate,
//         endDate,
//       },
//     });

//     // Update user subscription status to active
//     await prisma.user.update({
//       where: { id: userId },
//       data: { isSubscribed: true },
//     });

//     res.status(200).json(subscription);
//   } catch (error) {
//     console.error('Error creating subscription:', error);
//     res.status(500).json({ error: 'Error creating subscription' });
//   }
// }

// export function GET(req: NextApiRequest, res: NextApiResponse) {
//   res.setHeader('Allow', ['POST']);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, plan, startDate, endDate } = req.body;
    if (!userId || !plan || !startDate || !endDate) {
      throw new Error('Invalid input');
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

    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Error creating subscription' });
  }
}

export function GET(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}