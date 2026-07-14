import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';


export async function GET() {
  try {
    const jobs = await prisma.employerJob.findMany({
      where: { status: 'active' },
      include: {
        employer: {
          select: {
            companyName: true,
            industry: true,
            logoUrl: true,
            address: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching public employer jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
