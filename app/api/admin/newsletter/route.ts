import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const subs = await (prisma as any).newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
    return NextResponse.json(subs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await (prisma as any).newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ message: 'Subscriber removed' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
