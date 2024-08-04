// src/app/api/reset-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './../../lib/prisma';
import { sendResetEmail } from '../../../../lib/sendResetEmail'; // Assume you have a function to send email
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'User with this email does not exist' }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendResetEmail(email, resetToken);

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
