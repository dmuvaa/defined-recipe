import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from './../../lib/prisma';

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    // Check if error is an instance of Error to safely access the message
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If error is not an instance of Error, return a generic message
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
