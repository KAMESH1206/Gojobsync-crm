import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { notifyInterviewScheduled } from '@/lib/whatsapp';

// GET /api/interviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const interviewerId = searchParams.get('interviewerId') || '';

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (interviewerId) where.interviewerId = interviewerId;

    const interviews = await prisma.interview.findMany({
      where: where as any,
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        interviewer: { select: { name: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    const parsed = interviews.map(i => ({
      ...i,
      candidateName: i.candidate.name,
      requirementTitle: i.requirement.title,
      interviewerName: i.interviewer.name,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST /api/interviews
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const errors: string[] = [];
    if (!data.candidateId) errors.push('Candidate is required');
    if (!data.requirementId) errors.push('Requirement is required');
    if (!data.interviewerId) errors.push('Interviewer is required');
    if (!data.scheduledAt) errors.push('Schedule date/time is required');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const interview = await prisma.interview.create({
      data: {
        candidateId: data.candidateId,
        requirementId: data.requirementId,
        interviewerId: data.interviewerId,
        scheduledAt: data.scheduledAt,
        duration: Number(data.duration) || 60,
        type: data.type || 'technical',
        status: 'scheduled',
      },
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        interviewer: { select: { name: true } },
      },
    });

    // Update candidate status
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: 'interview_scheduled' },
    });

    // Send WhatsApp notification to candidate (fire-and-forget)
    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id: data.candidateId },
        select: { phone: true, name: true },
      });
      const phone = candidate?.phone;
      if (phone) {
        const name = candidate?.name || 'Candidate';
        const dt = new Date(data.scheduledAt);
        const dateStr = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        notifyInterviewScheduled(
          phone,
          name,
          interview.requirement.title,
          dateStr,
          timeStr,
          data.type || 'Technical',
          data.notes
        ).catch(console.error);
      }
    } catch (waErr) {
      console.error('[WhatsApp] Interview notification failed:', waErr);
    }

    return NextResponse.json({
      ...interview,
      candidateName: interview.candidate.name,
      requirementTitle: interview.requirement.title,
      interviewerName: interview.interviewer.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}
