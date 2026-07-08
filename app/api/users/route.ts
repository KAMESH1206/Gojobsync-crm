import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';

    const where: Record<string, unknown> = {};
    if (role && role !== 'all') where.role = role;

    const users = await prisma.user.findMany({
      where: where as any,
      select: { id: true, name: true, email: true, role: true, phone: true, department: true, isActive: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.password?.trim()) errors.push('Password is required');
    if (!data.role?.trim()) errors.push('Role is required');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Check email uniqueness
    const emailLower = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: emailLower,
        password: data.password.trim(),
        role: data.role,
        phone: data.phone?.trim() || '',
        department: data.department?.trim() || null,
        isActive: data.isActive !== false,
      },
      select: { id: true, name: true, email: true, role: true, phone: true, department: true, isActive: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
