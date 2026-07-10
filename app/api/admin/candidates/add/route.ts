import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.phone || !data.location) {
      return NextResponse.json({ message: 'Name, Email, Phone and Location are required' }, { status: 400 });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        skills: data.skills || '[]',
        experience: data.experience || '',
        education: data.education || '',
        location: data.location,
        resumeUrl: data.resumeUrl || null,
        status: 'new',
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
