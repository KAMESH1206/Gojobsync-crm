import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // In a real app, hash password here using bcryptjs
    // For now, storing as received (matching the existing project's structure as seen in auth/login)
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: password.trim(), // Assuming plaintext for now based on auth/login
        phone: phone || "",
        role: role,
        isActive: true,
      },
    });

    return NextResponse.json({ message: 'Admin registered successfully', user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
