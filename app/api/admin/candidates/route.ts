import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const STATUS_EMAIL_TEMPLATES: Record<string, { subject: string; html: (name: string) => string }> = {
  shortlisted: {
    subject: '🎉 Congratulations! You have been Shortlisted - THEJOBSYNC',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">THEJOBSYNC</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Congratulations, ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            We are thrilled to inform you that your profile has been <strong style="color: #059669;">shortlisted</strong> for the next round of our recruitment process.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #166534; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Shortlisted ✅</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            Our team will reach out to you shortly with further details regarding the interview process. Please keep your phone and email accessible.
          </p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 THEJOBSYNC.com — All Rights Reserved</p>
          <p style="color: #9ca3af; font-size: 11px; margin: 4px 0 0;">This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    `,
  },
  selected: {
    subject: '🏆 You have been Selected! - THEJOBSYNC',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">THEJOBSYNC</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🏆</span>
          </div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Congratulations, ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            We are delighted to inform you that you have been <strong style="color: #059669;">selected</strong> for the position!
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #166534; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Selected 🏆</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            Our HR team will contact you with the offer details and joining formalities. Welcome to the team!
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 THEJOBSYNC.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
  rejected: {
    subject: 'Application Update - THEJOBSYNC',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">THEJOBSYNC</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #374151; text-align: center; margin: 0 0 16px;">Dear ${name},</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            Thank you for your interest. After careful consideration, we regret to inform you that your application was not selected at this time.
          </p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
            We encourage you to apply for future openings. We wish you the best in your career journey.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 THEJOBSYNC.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
  interview_scheduled: {
    subject: '📅 Interview Scheduled - THEJOBSYNC',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">THEJOBSYNC</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">📅</span></div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Hello ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            Great news! Your interview has been <strong style="color: #2563eb;">scheduled</strong>. Our team will share the date, time, and meeting link shortly.
          </p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #1e40af; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Interview Scheduled 📅</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Please keep your resume and documents ready. Good luck!</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 THEJOBSYNC.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
};

async function sendStatusEmail(email: string, name: string, status: string) {
  const template = STATUS_EMAIL_TEMPLATES[status];
  if (!template) return; // No email for statuses like "new"

  try {
    await transporter.sendMail({
      from: `"THEJOBSYNC" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html(name),
    });
    console.log(`✅ Email sent to ${email} for status: ${status}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(candidates);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    const candidate = await prisma.candidate.update({ where: { id }, data });

    // Send auto email in background (fire-and-forget, don't block the response)
    if (data.status) {
      sendStatusEmail(candidate.email, candidate.name, data.status).catch(() => {});
    }

    return NextResponse.json(candidate);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.candidate.delete({ where: { id } });
    return NextResponse.json({ message: 'Candidate deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
