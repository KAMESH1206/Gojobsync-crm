import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const faqs = await (prisma as any).faq.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(faqs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const faq = await (prisma as any).faq.create({ data });
    return NextResponse.json(faq, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    const faq = await (prisma as any).faq.update({ where: { id }, data });
    return NextResponse.json(faq);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await (prisma as any).faq.delete({ where: { id } });
    return NextResponse.json({ message: 'FAQ deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
