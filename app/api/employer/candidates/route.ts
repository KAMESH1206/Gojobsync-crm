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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const field = searchParams.get('field') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const andConditions: Record<string, unknown>[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { headline: { contains: search } },
        { skills: { contains: search } },
        { currentRole: { contains: search } },
        { preferredRoles: { contains: search } },
      ],
    });
  }

  if (field) {
    andConditions.push({
      OR: [
        { preferredRoles: { contains: field } },
        { skills: { contains: field } },
        { headline: { contains: field } },
      ],
    });
  }

  if (location) {
    andConditions.push({ location: { contains: location } });
  }

  const where: Record<string, unknown> = {};
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const [candidates, total, savedCandidates] = await Promise.all([
    prisma.candidateAccount.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true,
        headline: true, skills: true, experience: true,
        education: true, location: true, currentCompany: true,
        currentRole: true, expectedSalary: true, preferredRoles: true,
        photoUrl: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.candidateAccount.count({ where }),
    prisma.employerSavedCandidate.findMany({
      where: { employerId },
      select: { candidateAccountId: true }
    })
  ]);

  const savedIds = new Set(savedCandidates.map(sc => sc.candidateAccountId));

  const formattedCandidates = candidates.map(c => ({
    ...c,
    isSaved: savedIds.has(c.id)
  }));

  return NextResponse.json({
    candidates: formattedCandidates,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

