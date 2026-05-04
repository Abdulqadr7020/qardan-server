"use server";

import * as React from 'react';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { OTPVerificationEmail } from '@/components/emails/OTPVerificationEmail';

export async function sendOtpEmail(email: string, name: string) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailHtml = await render(React.createElement(OTPVerificationEmail, { 
      name: name, 
      otpCode: otp 
    }));

    const mailOptions = {
      from: `"Qardan Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Qardan DigiLocker: Your Secure Access Code',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, otp };
  } catch (err) {
    console.error('Auth Action Error:', err);
    return { success: false, error: 'Internal server error' };
  }
}
