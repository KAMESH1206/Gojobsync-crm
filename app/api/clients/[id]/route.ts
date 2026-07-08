import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/clients/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id },
      include: { requirements: true, placements: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

// PUT /api/clients/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const errors: string[] = [];
    if (data.companyName !== undefined && !data.companyName?.trim()) errors.push('Company name is required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(data.companyName && { companyName: data.companyName.trim() }),
        ...(data.contactPerson && { contactPerson: data.contactPerson.trim() }),
        ...(data.email && { email: data.email.trim() }),
        ...(data.phone && { phone: data.phone.trim() }),
        ...(data.address && { address: data.address.trim() }),
        ...(data.industry && { industry: data.industry.trim() }),
        ...(data.website !== undefined && { website: data.website?.trim() || null }),
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

// DELETE /api/clients/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check for related requirements
    const reqCount = await prisma.jobRequirement.count({ where: { clientId: id } });
    if (reqCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: client has ${reqCount} requirement(s). Remove them first.` },
        { status: 409 }
      );
    }

    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
