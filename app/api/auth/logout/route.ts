import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find today's attendance record
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const attendance = await (prisma as any).attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateString,
        }
      },
      include: {
        sessions: {
          orderBy: { loginTime: 'desc' },
          take: 1
        }
      }
    });

    if (attendance) {
      const now = new Date();
      
      // Update the latest active session
      if (attendance.sessions && attendance.sessions.length > 0) {
        const latestSession = attendance.sessions[0];
        if (!latestSession.logoutTime) {
          await (prisma as any).attendanceSession.update({
            where: { id: latestSession.id },
            data: { logoutTime: now }
          });
        }
      }

      // Re-calculate total hours for the day based on all sessions
      const allSessions = await (prisma as any).attendanceSession.findMany({
        where: { attendanceId: attendance.id }
      });

      let totalMs = 0;
      allSessions.forEach((s: any) => {
        if (s.loginTime && s.logoutTime) {
          totalMs += new Date(s.logoutTime).getTime() - new Date(s.loginTime).getTime();
        } else if (s.loginTime) {
          // If a session is somehow still active (e.g. they had another tab and just closed this one)
          // We can use the current time, or just ignore it.
          // Since they are logging out, we assume it's ended.
          totalMs += now.getTime() - new Date(s.loginTime).getTime();
        }
      });

      const totalHours = totalMs / (1000 * 60 * 60);

      // Also update the main attendance record's logout time and total hours
      await (prisma as any).attendance.update({
        where: { id: attendance.id },
        data: {
          logoutTime: now,
          totalHours: totalHours
        }
      });
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to process logout' }, { status: 500 });
  }
}
