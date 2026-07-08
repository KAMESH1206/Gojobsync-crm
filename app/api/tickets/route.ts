import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    // A user can see tickets they created OR tickets assigned to their role
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assignedRole: role },
        ]
      },
      include: {
        creator: { select: { name: true, role: true } },
        messages: {
          include: { sender: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.creatorId || !data.assignedRole || !data.subject || !data.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        creatorId: data.creatorId,
        assignedRole: data.assignedRole,
        subject: data.subject,
        messages: {
          create: {
            senderId: data.creatorId,
            message: data.message
          }
        }
      },
      include: {
        creator: { select: { name: true, role: true } },
        messages: {
          include: { sender: { select: { name: true, role: true } } }
        }
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
