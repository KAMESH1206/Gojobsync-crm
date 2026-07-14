import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';


const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

async function getEmployerId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.employerId as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const jobs = await prisma.employerJob.findMany({
    where: { employerId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { title, description, skills, experience, location, salaryRange, jobType, field, openings } =
      await req.json();

    if (!title || !description || !location || !field) {
      return NextResponse.json({ error: 'Title, description, location and field are required' }, { status: 400 });
    }

    const job = await prisma.employerJob.create({
      data: {
        employerId,
        title,
        description,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        experience: experience || 'Any',
        location,
        salaryRange: salaryRange || 'Negotiable',
        jobType: jobType || 'full-time',
        field,
        openings: openings || 1,
        status: 'active',
      },
    });

    // Bridge: Create Client and JobRequirement so it appears in CRM & Careers
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        let client = await prisma.client.findFirst({ where: { email: employer.email } });
        if (!client) {
          client = await prisma.client.create({
            data: {
              companyName: employer.companyName,
              contactPerson: employer.contactPerson,
              email: employer.email,
              phone: employer.contactPhone,
              address: employer.address,
              industry: employer.industry,
              website: employer.website || '',
              status: 'active'
            }
          });
        }

        await prisma.jobRequirement.create({
          data: {
            clientId: client.id,
            title,
            description,
            skills: JSON.stringify(Array.isArray(skills) ? skills : []),
            experience: experience || 'Any',
            positions: openings || 1,
            location,
            salaryRange: salaryRange || 'Negotiable',
            status: 'open',
            priority: 'medium',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        });
      }
    } catch (bridgeError) {
      console.error('Failed to bridge employer job to CRM:', bridgeError);
    }

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error('create job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });

    const job = await prisma.employerJob.findUnique({ where: { id } });
    if (!job || job.employerId !== employerId) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    await prisma.employerJob.delete({ where: { id } });

    // Also try to close/delete the corresponding JobRequirement in CRM
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        const client = await prisma.client.findFirst({ where: { email: employer.email } });
        if (client) {
          // Find the requirement with the same title created for this client
          const requirements = await prisma.jobRequirement.findMany({
            where: { clientId: client.id, title: job.title },
            orderBy: { createdAt: 'desc' },
            take: 1
          });
          if (requirements.length > 0) {
            await prisma.jobRequirement.delete({ where: { id: requirements[0].id } });
          }
        }
      }
    } catch (e) {
      console.error('Failed to delete bridged requirement', e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
