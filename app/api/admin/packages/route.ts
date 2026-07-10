import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const packages = await (prisma as any).package.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(packages);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const pkg = await (prisma as any).package.create({ data });
    return NextResponse.json(pkg, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    const pkg = await (prisma as any).package.update({ where: { id }, data });
    return NextResponse.json(pkg);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await (prisma as any).package.delete({ where: { id } });
    return NextResponse.json({ message: 'Package deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
