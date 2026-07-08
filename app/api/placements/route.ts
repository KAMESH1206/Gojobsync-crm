import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/placements
export async function GET() {
  try {
    const placements = await prisma.placement.findMany({
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        client: { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = placements.map(p => ({
      ...p,
      candidateName: p.candidate.name,
      requirementTitle: p.requirement.title,
      clientName: p.client.companyName,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch placements' }, { status: 500 });
  }
}

// POST /api/placements
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const errors: string[] = [];
    if (!data.candidateId) errors.push('Candidate is required');
    if (!data.requirementId) errors.push('Requirement is required');
    if (!data.clientId) errors.push('Client is required');
    if (!data.position?.trim()) errors.push('Position is required');
    if (!data.salary?.trim()) errors.push('Salary is required');
    if (!data.joiningDate) errors.push('Joining date is required');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const placement = await prisma.placement.create({
      data: {
        candidateId: data.candidateId,
        requirementId: data.requirementId,
        clientId: data.clientId,
        position: data.position.trim(),
        salary: data.salary.trim(),
        joiningDate: data.joiningDate,
        status: data.status || 'offer_sent',
        notes: data.notes?.trim() || null,
      },
      include: {
        candidate: { select: { name: true } },
        requirement: { select: { title: true } },
        client: { select: { companyName: true } },
      },
    });

    // Update candidate status
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: 'offered' },
    });

    return NextResponse.json({
      ...placement,
      candidateName: placement.candidate.name,
      requirementTitle: placement.requirement.title,
      clientName: placement.client.companyName,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create placement' }, { status: 500 });
  }
}
