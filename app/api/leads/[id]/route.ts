import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gojobsync_jwt_secret_2024_secure'
);

async function getUserFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromToken(req);
    if (!user || !['coordinator', 'super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.companyLead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Prepare data
    const updateData: any = {};
    if (body.status) updateData.status = body.status;

    // If it's a full update (interested) or partial update
    if (body.companyName) updateData.companyName = body.companyName;
    if (body.contactPerson) updateData.contactPerson = body.contactPerson;
    if (body.position) updateData.position = body.position;
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;
    if (body.website) updateData.website = body.website;
    if (body.address) updateData.address = body.address;
    if (body.requirementDetails) updateData.requirementDetails = body.requirementDetails;
    if (body.validityTime) updateData.validityTime = body.validityTime;
    if (body.remark) updateData.remark = body.remark;

    const lead = await prisma.companyLead.update({
      where: { id },
      data: updateData,
      include: {
        dms: { select: { name: true } },
        coordinator: { select: { name: true } }
      }
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
