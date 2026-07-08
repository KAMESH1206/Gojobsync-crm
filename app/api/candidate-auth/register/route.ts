import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/candidate-auth/register
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, password } = data;

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await (prisma as any).candidateAccount.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const account = await (prisma as any).candidateAccount.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), password }
    });

    const { password: _, ...safeAccount } = account;
    return NextResponse.json(safeAccount, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
