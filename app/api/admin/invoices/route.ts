import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const invoices = await (prisma as any).invoice.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const invoice = await (prisma as any).invoice.update({
      where: { id },
      data: { status, ...(status === 'paid' ? { paidAt: new Date() } : {}) },
    });

    if (status === 'paid' && invoice.email) {
      prisma.employer.findUnique({
        where: { email: invoice.email }
      }).then(async (emp: any) => {
        if (emp && emp.contactPhone) {
          const { notifyInvoiceSent } = await import('@/lib/whatsapp');
          notifyInvoiceSent(
            emp.contactPhone,
            emp.contactPerson || emp.companyName,
            invoice.invoiceNumber,
            invoice.totalAmount.toString()
          ).catch(console.error);
        }
      }).catch((e: any) => console.error('[WhatsApp] Find employer error for invoice:', e));
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
