import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/clients — List all clients with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { industry: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const clients = await prisma.client.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST /api/clients — Create a new client
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation
    const errors: string[] = [];
    if (!data.companyName?.trim()) errors.push('Company name is required');
    if (!data.contactPerson?.trim()) errors.push('Contact person is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.phone?.trim()) errors.push('Phone is required');
    if (!data.address?.trim()) errors.push('Address is required');
    if (!data.industry?.trim()) errors.push('Industry is required');

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        companyName: data.companyName.trim(),
        contactPerson: data.contactPerson.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        industry: data.industry.trim(),
        website: data.website?.trim() || null,
        status: data.status || 'active',
        notes: data.notes?.trim() || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
