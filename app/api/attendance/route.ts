import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pendingOnly = searchParams.get('pending') === 'true';

    const where = pendingOnly ? { isApproved: false } : {};

    const attendances = await prisma.attendance.findMany({
      where,
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(attendances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, isApproved } = data;

    if (!id) return NextResponse.json({ error: 'Missing attendance ID' }, { status: 400 });

    const attendance = await prisma.attendance.update({
      where: { id },
      data: { isApproved }
    });

    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
