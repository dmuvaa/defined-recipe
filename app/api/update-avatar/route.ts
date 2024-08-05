import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { image } = await req.json();

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image },
    });
    return NextResponse.json({ message: 'Avatar updated successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
