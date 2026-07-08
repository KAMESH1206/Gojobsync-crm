import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateAccountId');
  if (!candidateId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const messages = await prisma.candidateMessage.findMany({
      where: { candidateAccountId: candidateId },
      orderBy: { sentAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message, candidateAccountId } = await req.json();
    if (!candidateAccountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!message) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });

    const newMsg = await prisma.candidateMessage.create({
      data: {
        candidateAccountId: candidateAccountId,
        message,
        sender: 'candidate'
      }
    });
    
    return NextResponse.json(newMsg);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
