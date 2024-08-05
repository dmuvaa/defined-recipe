// src/app/api/reset-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { sendResetEmail } from '../../lib/sendResetEmail';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { email } = await req.json();

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'User with this email does not exist' }, { status: 400 });
    }

    // Generate a reset token and set an expiry time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update the user record with the reset token and expiry time
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send the reset email
    await sendResetEmail(email, resetToken);

    // Return a success response
    return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing reset request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
