import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        client: { select: { companyName: true } },
      },
    });
    if (!placement) return NextResponse.json({ error: 'Placement not found' }, { status: 404 });
    return NextResponse.json({
      ...placement,
      candidateName: placement.candidate.name,
      requirementTitle: placement.requirement.title,
      clientName: placement.client.companyName,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch placement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    if (data.position !== undefined) updateData.position = data.position.trim();
    if (data.salary !== undefined) updateData.salary = data.salary.trim();
    if (data.joiningDate !== undefined) updateData.joiningDate = data.joiningDate;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;

    const placement = await prisma.placement.update({
      where: { id },
      data: updateData,
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        client: { select: { companyName: true } },
      },
    });

    // Update candidate status based on placement status
    if (data.status === 'joined') {
      await prisma.candidate.update({
        where: { id: placement.candidateId },
        data: { status: 'joined' },
      });
      // Increment filledPositions on requirement
      await prisma.jobRequirement.update({
        where: { id: placement.requirementId },
        data: { filledPositions: { increment: 1 } },
      });
    }

    return NextResponse.json({
      ...placement,
      candidateName: placement.candidate.name,
      requirementTitle: placement.requirement.title,
      clientName: placement.client.companyName,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update placement' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.placement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete placement' }, { status: 500 });
  }
}
