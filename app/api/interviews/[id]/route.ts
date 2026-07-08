import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: { select: { name: true, email: true, phone: true } },
        requirement: { select: { title: true } },
        interviewer: { select: { name: true } },
      },
    });
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    return NextResponse.json({
      ...interview,
      candidateName: interview.candidate.name,
      requirementTitle: interview.requirement.title,
      interviewerName: interview.interviewer.name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt;
    if (data.duration !== undefined) updateData.duration = Number(data.duration);
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.feedback !== undefined) updateData.feedback = data.feedback;
    if (data.rating !== undefined) updateData.rating = Number(data.rating);
    if (data.recommendation !== undefined) updateData.recommendation = data.recommendation;

    const interview = await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        interviewer: { select: { name: true } },
      },
    });

    // If completed, update candidate status
    if (data.status === 'completed') {
      await prisma.candidate.update({
        where: { id: interview.candidateId },
        data: { status: 'interviewed' },
      });
    }
    // If recommendation is select, update candidate
    if (data.recommendation === 'select') {
      await prisma.candidate.update({
        where: { id: interview.candidateId },
        data: { status: 'selected' },
      });
    }

    return NextResponse.json({
      ...interview,
      candidateName: interview.candidate.name,
      requirementTitle: interview.requirement.title,
      interviewerName: interview.interviewer.name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.interview.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}
