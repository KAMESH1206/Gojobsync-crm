import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.status || !['approved', 'rejected'].includes(data.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: { status: data.status },
      include: { user: true }
    });

    // Notify the user about the leave status change
    await prisma.notification.create({
      data: {
        userId: leave.userId,
        title: `Leave Request ${data.status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been ${data.status}.`,
        type: data.status === 'approved' ? 'success' : 'error',
      }
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error('Failed to update leave request:', error);
    return NextResponse.json({ error: 'Failed to update leave request' }, { status: 500 });
  }
}
