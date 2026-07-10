import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [
      totalCandidates,
      totalCompanies,
      totalJobs,
      pendingJobs,
      totalUsers,
      totalInvoices,
      totalPackages,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.client.count(),
      prisma.jobRequirement.count(),
      prisma.jobRequirement.count({ where: { status: 'open' } }),
      prisma.user.count(),
      (prisma as any).invoice.count().catch(() => 0),
      (prisma as any).package.count().catch(() => 0),
    ]);

    return NextResponse.json({
      totalCandidates,
      totalCompanies,
      totalJobs,
      pendingJobs,
      totalUsers,
      totalInvoices,
      totalPackages,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
