import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await (prisma as any).paymentSetting.findFirst();
    return NextResponse.json(settings || { gatewayName: 'razorpay', apiKey: '', apiSecret: '', gstRate: 18, invoicePrefix: 'INV', isActive: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const existing = await (prisma as any).paymentSetting.findFirst();
    let settings;
    if (existing) {
      settings = await (prisma as any).paymentSetting.update({ where: { id: existing.id }, data });
    } else {
      settings = await (prisma as any).paymentSetting.create({ data });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
