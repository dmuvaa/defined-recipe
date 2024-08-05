// // src/app/api/subscription/route.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import Paystack from 'paystack-node';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/route';
// import { prisma } from '../../lib/prisma';

// const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getServerSession(req, res, authOptions);
//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const { plan } = req.body;
//   const amount = plan === 'monthly' ? 499 * 100 : 3999 * 100;
//   const reference = `sub_${session.userId}_${Date.now()}`;

//   try {
//     const response = await paystack.transaction.initialize({
//       email: session.user.email,
//       amount,
//       reference,
//       callback_url: `${process.env.NEXTAUTH_URL}/api/subscription/webhook`,
//     });

//     res.status(200).json({ authorization_url: response.data.authorization_url });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
