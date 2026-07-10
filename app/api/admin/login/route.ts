import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isActive: true },
    });

    if (!user || user.password !== password.trim()) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return NextResponse.json({ message: 'Unauthorized. Not an admin account.' }, { status: 403 });
    }

    // Return success and role
    return NextResponse.json({ 
      message: 'Login successful', 
      role: user.role,
      user: { id: user.id, email: user.email, name: user.name } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
