// // src/app/api/update-avatar/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]/authOptions';
// import { prisma } from '../../lib/prisma';

// export async function POST(req: NextRequest) {
//   const session = await getServerSession({ req, options: authOptions });

//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { image } = await req.json();

//   try {
//     await prisma.user.update({
//       where: { email: session.user.email },
//       data: { image },
//     });
//     return NextResponse.json({ message: 'Avatar updated successfully' });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
//   }
// }
