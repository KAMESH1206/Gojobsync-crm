import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic Validation
    if (!data.name || !data.email || !data.phone || !data.experience || !data.education || !data.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get all active HRs
    const activeHrs = await prisma.user.findMany({
      where: { role: 'hr', isActive: true },
      select: { id: true, name: true }
    });

    if (activeHrs.length === 0) {
      return NextResponse.json({ error: 'No active HR professionals found to handle this application' }, { status: 503 });
    }

    // 2. Round Robin Logic: Find HR with the least active candidates
    // Active Candidate Statuses: new, shortlisted, interview_scheduled, interviewed, offered
    const hrLoads = await Promise.all(
      activeHrs.map(async (hr) => {
        const count = await prisma.candidate.count({
          where: {
            assignedHrId: hr.id,
            status: { in: ['new', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered'] }
          }
        });
        return { hrId: hr.id, count };
      })
    );

    // Sort ascending by count
    hrLoads.sort((a, b) => a.count - b.count);
    const selectedHrId = hrLoads[0].hrId;

    // 3. Create candidate and assign to HR
    const candidate = await prisma.candidate.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        skills: JSON.stringify(data.skills || []),
        experience: data.experience.trim(),
        education: data.education.trim(),
        currentCompany: data.currentCompany?.trim() || null,
        currentRole: data.currentRole?.trim() || null,
        expectedSalary: data.expectedSalary?.trim() || null,
        location: data.location.trim(),
        appliedFor: data.appliedFor || null,
        assignedHrId: selectedHrId,
        status: 'new'
      }
    });

    // Send WhatsApp notification to candidate (fire-and-forget)
    try {
      let jobTitle = "a job";
      let companyName = "The jobsync Client";
      if (data.appliedFor) {
        const requirement = await prisma.jobRequirement.findUnique({
          where: { id: data.appliedFor },
          include: { client: true }
        });
        if (requirement) {
          jobTitle = requirement.title;
          if (requirement.client) {
            companyName = requirement.client.companyName;
          }
        }
      }
      const { notifyCandidateApplied } = await import('@/lib/whatsapp');
      notifyCandidateApplied(candidate.phone, candidate.name, jobTitle, companyName).catch(console.error);
    } catch (waErr) {
      console.error('[WhatsApp] Candidate apply notification failed:', waErr);
    }

    return NextResponse.json({ success: true, candidateId: candidate.id }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
