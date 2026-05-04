import * as React from 'react';

interface OtpEmailProps {
  otp: string;
  recipientName: string;
}

export const OtpEmail: React.FC<Readonly<OtpEmailProps>> = ({
  otp,
  recipientName,
}) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#09090b',
    color: '#fafafa',
    padding: '40px 20px',
    borderRadius: '16px',
    maxWidth: '500px',
    margin: '0 auto',
    border: '1px solid #27272a'
  }}>
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <div style={{
        display: 'inline-block',
        backgroundColor: '#06b6d4',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <img 
          src="https://qardan-hasan-app.vercel.app/logo.png" 
          alt="Qardan Logo" 
          style={{ width: '32px', height: '32px', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#fff' }}>Qardan DigiLocker</h1>
      <p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px' }}>Secure Management Portal</p>
    </div>

    <div style={{
      backgroundColor: '#18181b',
      padding: '32px',
      borderRadius: '16px',
      border: '1px solid #27272a',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Security Verification</h2>
      <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '24px' }}>
        Hello {recipientName}, someone is attempting to log in to your account. Use the code below to verify your identity.
      </p>

      <div style={{
        backgroundColor: '#000',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #06b6d433',
        marginBottom: '24px'
      }}>
        <span style={{
          fontSize: '32px',
          fontWeight: '900',
          letterSpacing: '8px',
          color: '#06b6d4',
          fontFamily: 'monospace'
        }}>
          {otp}
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#52525b' }}>
        This code will expire in 110 minutes. If you did not request this code, please ignore this email.
      </p>
    </div>

    <div style={{ textAlign: 'center', marginTop: '32px' }}>
      <p style={{ fontSize: '11px', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
        Protected by Qardan Security System
      </p>
    </div>
  </div>
);
