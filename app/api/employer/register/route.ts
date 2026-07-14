import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';


export async function POST(req: NextRequest) {
  try {
    const {
      companyName, gstNumber, address, contactPerson, contactPhone,
      email, password, industry, about
    } = await req.json();

    if (!companyName || !email || !password || !gstNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.employer.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const employer = await prisma.employer.create({
      data: {
        companyName,
        gstNumber,
        address: address || '',
        contactPerson: contactPerson || '',
        contactPhone: contactPhone || '',
        email: email.toLowerCase(),
        password: hashedPassword,
        industry: industry || 'Other',
        about: about || '',
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      employer: { id: employer.id, companyName: employer.companyName, email: employer.email },
    });
  } catch (err) {
    console.error('employer register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
