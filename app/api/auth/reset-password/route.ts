import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find the token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (resetRecord.email !== email) {
      return NextResponse.json({ error: 'Invalid token for this email' }, { status: 400 });
    }

    if (new Date() > resetRecord.expiresAt) {
      // Delete expired token
      await prisma.passwordReset.delete({ where: { id: resetRecord.id } });
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // 2. Update the password based on role
    // NOTE: Passwords are currently stored as plain text in this project according to existing auth routes.
    // In a real production app, we would hash the password here (e.g., bcrypt.hash(newPassword, 10)).
    
    if (resetRecord.role === 'employer') {
      await prisma.employer.update({
        where: { email },
        data: { password: newPassword }
      });
    } else if (resetRecord.role === 'candidate') {
      await prisma.candidateAccount.update({
        where: { email },
        data: { password: newPassword }
      });
    } else {
      // internal CRM users
      await prisma.user.update({
        where: { email },
        data: { password: newPassword }
      });
    }

    // 3. Delete the token so it cannot be used again
    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });

    return NextResponse.json({ success: true, message: 'Password has been reset successfully' }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
