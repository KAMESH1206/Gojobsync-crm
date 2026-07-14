import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory store — must match the one in send-otp/route.ts
// Using global to persist across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

const otpStore: Map<string, { otp: string; expiresAt: number }> =
  global.__otpStore ?? (global.__otpStore = new Map());

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const key = email.toLowerCase();
    const record = otpStore.get(key);

    if (!record) {
      return NextResponse.json({ error: 'OTP not found. Please request a new OTP.' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    if (record.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // OTP verified — remove it to prevent reuse
    otpStore.delete(key);

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
