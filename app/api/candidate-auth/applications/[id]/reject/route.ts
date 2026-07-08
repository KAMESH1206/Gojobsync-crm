import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;

    const application = await (prisma as any).candidateApplication.findUnique({
      where: { id },
      include: { candidateAccount: true }
    });

    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    const crmCandidate = await prisma.candidate.findFirst({
      where: { email: application.candidateAccount.email, appliedFor: application.requirementId }
    });

    if (crmCandidate) {
      // Update Candidate status to rejected
      await prisma.candidate.update({
        where: { id: crmCandidate.id },
        data: { status: 'rejected' }
      });

      // Update Placement status to rejected if it exists
      const placement = await prisma.placement.findFirst({
        where: { candidateId: crmCandidate.id },
        orderBy: { createdAt: 'desc' }
      });

      if (placement) {
        await prisma.placement.update({
          where: { id: placement.id },
          data: { status: 'rejected' }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reject offer' }, { status: 500 });
  }
}
