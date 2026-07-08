import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const records = await prisma.attendance.findMany({
      where: { userId },
      include: { sessions: true },
      orderBy: { date: 'desc' },
      take: limit,
    });

    // We can enrich the records by calculating whether they hit the 9hr mark
    const enriched = records.map(record => {
      let is9Hours = false;
      let effectiveHours = 0;
      let totalHours = record.totalHours || 0;

      if (record.sessions && record.sessions.length > 0) {
        let totalMs = 0;
        record.sessions.forEach((s: any) => {
          if (s.loginTime && s.logoutTime) {
            totalMs += new Date(s.logoutTime).getTime() - new Date(s.loginTime).getTime();
          } else if (s.loginTime) {
            // Active session (not logged out yet)
            totalMs += new Date().getTime() - new Date(s.loginTime).getTime();
          }
        });
        totalHours = totalMs / (1000 * 60 * 60);
      } else if (record.loginTime && record.logoutTime) {
        // Fallback for old records without sessions
        const ms = new Date(record.logoutTime).getTime() - new Date(record.loginTime).getTime();
        totalHours = ms / (1000 * 60 * 60);
      } else if (record.loginTime) {
        const ms = new Date().getTime() - new Date(record.loginTime).getTime();
        totalHours = ms / (1000 * 60 * 60);
      }

      // If they worked > 1 hour, assume 1 hour break is taken
      if (totalHours > 1) {
        effectiveHours = totalHours - 1;
      } else {
        effectiveHours = totalHours;
      }

      if (effectiveHours >= 9) {
        is9Hours = true;
      }

      return {
        ...record,
        totalHours, // Raw hours
        effectiveHours, // Hours minus break
        is9Hours,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
