import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/requirements/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const req = await prisma.jobRequirement.findUnique({
      where: { id },
      include: { client: { select: { companyName: true } }, candidates: true, interviews: true },
    });

    if (!req) return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });

    return NextResponse.json({
      ...req,
      clientName: req.client.companyName,
      skills: JSON.parse(req.skills),
      assignedRecruiters: JSON.parse(req.assignedRecruiters),
    });
  } catch (error) {
    console.error('Error fetching requirement:', error);
    return NextResponse.json({ error: 'Failed to fetch requirement' }, { status: 500 });
  }
}

// PUT /api/requirements/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.skills !== undefined) updateData.skills = JSON.stringify(data.skills);
    if (data.experience !== undefined) updateData.experience = data.experience.trim();
    if (data.positions !== undefined) updateData.positions = Number(data.positions);
    if (data.filledPositions !== undefined) updateData.filledPositions = Number(data.filledPositions);
    if (data.location !== undefined) updateData.location = data.location.trim();
    if (data.salaryRange !== undefined) updateData.salaryRange = data.salaryRange.trim();
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assignedRecruiters !== undefined) updateData.assignedRecruiters = JSON.stringify(data.assignedRecruiters);
    if (data.deadline !== undefined) updateData.deadline = data.deadline;

    const req = await prisma.jobRequirement.update({
      where: { id },
      data: updateData,
      include: { client: { select: { companyName: true } } },
    });

    return NextResponse.json({
      ...req,
      clientName: req.client.companyName,
      skills: JSON.parse(req.skills),
      assignedRecruiters: JSON.parse(req.assignedRecruiters),
    });
  } catch (error) {
    console.error('Error updating requirement:', error);
    return NextResponse.json({ error: 'Failed to update requirement' }, { status: 500 });
  }
}

// DELETE /api/requirements/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const candCount = await prisma.candidate.count({ where: { appliedFor: id } });
    if (candCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${candCount} candidate(s) linked. Remove them first.` },
        { status: 409 }
      );
    }

    await prisma.jobRequirement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting requirement:', error);
    return NextResponse.json({ error: 'Failed to delete requirement' }, { status: 500 });
  }
}
