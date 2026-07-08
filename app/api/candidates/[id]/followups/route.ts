import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const followUps = await prisma.followUp.findMany({
      where: { candidateId: params.id },
      orderBy: { createdAt: 'desc' },
      include: { hr: { select: { name: true } } }
    });
    return NextResponse.json(followUps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const data = await request.json();
    const candidateId = params.id;

    if (!data.hrId || !data.status) {
      return NextResponse.json({ error: 'hrId and status are required' }, { status: 400 });
    }

    const followUp = await prisma.followUp.create({
      data: {
        candidateId,
        hrId: data.hrId,
        status: data.status,
        remarks: data.remarks || null
      }
    });

    // Update candidate status based on HR action
    let newCandidateStatus = data.status; // RNR, Switch Off, Call Back, Interested, Not Interested

    // If 'Interested', trigger Interviewer Round Robin
    if (data.status === 'Interested') {
      const activeInterviewers = await prisma.user.findMany({
        where: { role: 'interviewer', isActive: true },
        select: { id: true }
      });

      if (activeInterviewers.length > 0) {
        const interviewerLoads = await Promise.all(
          activeInterviewers.map(async (intv) => {
            const count = await prisma.candidate.count({
              where: {
                assignedInterviewerId: intv.id,
                status: 'Interested' // candidates currently assigned to them for interview
              }
            });
            return { id: intv.id, count };
          })
        );

        interviewerLoads.sort((a, b) => a.count - b.count);
        const selectedInterviewerId = interviewerLoads[0].id;

        await prisma.candidate.update({
          where: { id: candidateId },
          data: { 
            status: 'Interested', 
            assignedInterviewerId: selectedInterviewerId 
          }
        });
      } else {
        // No interviewers available, just update status
        await prisma.candidate.update({ where: { id: candidateId }, data: { status: 'Interested' } });
      }
    } else {
      await prisma.candidate.update({ where: { id: candidateId }, data: { status: newCandidateStatus } });
    }

    return NextResponse.json(followUp, { status: 201 });
  } catch (error) {
    console.error('Failed to add follow-up:', error);
    return NextResponse.json({ error: 'Failed to add follow-up' }, { status: 500 });
  }
}
