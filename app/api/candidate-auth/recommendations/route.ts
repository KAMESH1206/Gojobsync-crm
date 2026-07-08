import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('candidate_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_12345');
    let payload;
    try {
      const { payload: p } = await jose.jwtVerify(token, secret);
      payload = p;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const candidate = await prisma.candidateAccount.findUnique({
      where: { id: payload.id as string }
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const candidateSkills = JSON.parse(candidate.skills || '[]');
    if (candidateSkills.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    const candidateSkillsLower = candidateSkills.map((s: string) => s.toLowerCase());

    const openJobs = await prisma.jobRequirement.findMany({
      where: { status: 'open' },
      include: { client: true }
    });

    // Score jobs based on matching skills
    const scoredJobs = openJobs.map((job: any) => {
      let matchCount = 0;
      let jobSkills: string[] = [];
      try {
        jobSkills = JSON.parse(job.skills || '[]');
      } catch (e) {}

      jobSkills.forEach(skill => {
        if (candidateSkillsLower.includes(skill.toLowerCase())) {
          matchCount++;
        }
      });

      return {
        ...job,
        skills: jobSkills,
        matchCount,
        matchPercentage: jobSkills.length > 0 ? Math.round((matchCount / jobSkills.length) * 100) : 0
      };
    });

    // Filter jobs with at least 1 match, and sort by highest match count
    const recommendations = scoredJobs
      .filter(job => job.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 10); // Return top 10 recommendations

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
