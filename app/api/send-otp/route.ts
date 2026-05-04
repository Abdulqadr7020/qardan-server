import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// POST /api/send-otp
// Called by the React Native mobile app to send OTP emails
// Body: { email: string, name: string }
// Returns: { success: true, otp: string } | { success: false, error: string }
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'Missing email or name' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background: #09090b; padding: 40px; max-width: 480px; margin: 0 auto; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #06b6d4; padding: 12px 20px; border-radius: 12px;">
            <span style="color: #09090b; font-size: 18px; font-weight: 900;">🔒 Qardan DigiLocker</span>
          </div>
        </div>
        <h2 style="color: #fafafa; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 8px;">
          Verification Code
        </h2>
        <p style="color: #71717a; font-size: 14px; text-align: center; margin-bottom: 32px;">
          Hi ${name}, use the code below to complete your admin login.
        </p>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-family: monospace; font-size: 36px; font-weight: 900; color: #06b6d4; letter-spacing: 12px;">
            ${otp}
          </span>
        </div>
        <p style="color: #52525b; font-size: 12px; text-align: center;">
          This code expires in 10 minutes. Do not share it with anyone.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Qardan Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Qardan DigiLocker: Your Secure Access Code',
      html: htmlBody,
    });

    return NextResponse.json({ success: true, otp });
  } catch (err) {
    console.error('[send-otp API Error]', err);
    return NextResponse.json({ success: false, error: 'Failed to send OTP email' }, { status: 500 });
  }
}
