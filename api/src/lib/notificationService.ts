import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email service configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// SMS service configuration
const smsClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send email using SMTP
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@aether-identity.com',
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send SMS using Twilio
 */
export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    await smsClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}