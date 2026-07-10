import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET all jobs
export async function GET() {
  try {
    const jobs = await prisma.jobRequirement.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT - approve/reject
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const job = await prisma.jobRequirement.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
