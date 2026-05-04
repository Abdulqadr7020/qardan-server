import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
} from '@react-email/components';

interface OTPVerificationEmailProps {
  name: string;
  otpCode: string;
}

export const OTPVerificationEmail: React.FC<Readonly<OTPVerificationEmailProps>> = ({
  name,
  otpCode,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={headerText}>Qardan DigiLocker</Heading>
          </Section>
          
          <Section style={contentSection}>
            <Text style={greeting}>Hello {name},</Text>
            <Text style={text}>
              You are attempting to access the Qardan DigiLocker Admin Portal.
              Please use the following verification code to complete your login process.
            </Text>
            
            <Section style={otpSection}>
              <Text style={otpText}>{otpCode}</Text>
            </Section>
            
            <Text style={warningText}>
              This code will expire in 10 minutes. If you did not request this verification, 
              please secure your account immediately.
            </Text>
            
            <Hr style={divider} />
            
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Qardan DigiLocker. All rights reserved.<br />
              This is an automated security message, please do not reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  margin: '0 auto',
  maxWidth: '500px',
  overflow: 'hidden',
};

const headerSection = {
  backgroundColor: '#09090b',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const headerText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
};

const contentSection = {
  padding: '32px',
};

const greeting = {
  color: '#09090b',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px',
};

const text = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '24px',
  marginBottom: '24px',
};

const otpSection = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  marginBottom: '24px',
  border: '1px dashed #d4d4d8',
};

const otpText = {
  color: '#06b6d4',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
};

const warningText = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '20px',
  marginBottom: '24px',
};

const divider = {
  borderColor: '#e4e4e7',
  margin: '24px 0',
};

const footerText = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
};

export default OTPVerificationEmail;
