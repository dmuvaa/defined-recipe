import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle unique constraint error (e.g., email already exists)
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
