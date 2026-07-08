import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (data.action === 'reply') {
      if (!data.senderId || !data.message) {
        return NextResponse.json({ error: 'Missing senderId or message' }, { status: 400 });
      }

      const ticket = await prisma.ticket.update({
        where: { id },
        data: {
          messages: {
            create: {
              senderId: data.senderId,
              message: data.message
            }
          }
        },
        include: {
          creator: { select: { name: true, role: true } },
          messages: {
            include: { sender: { select: { name: true, role: true } } },
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      return NextResponse.json(ticket);
    } 
    
    if (data.action === 'status') {
      if (!data.status) {
        return NextResponse.json({ error: 'Missing status' }, { status: 400 });
      }

      const ticket = await prisma.ticket.update({
        where: { id },
        data: { status: data.status },
        include: {
          creator: { select: { name: true, role: true } },
          messages: {
            include: { sender: { select: { name: true, role: true } } },
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      return NextResponse.json(ticket);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
