"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendSMS = sendSMS;
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
// Email service configuration
const emailTransporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// SMS service configuration
const smsClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
/**
 * Send email using SMTP
 */
async function sendEmail(to, subject, html) {
    try {
        await emailTransporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@aether-identity.com',
            to,
            subject,
            html
        });
        return true;
    }
    catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
/**
 * Send SMS using Twilio
 */
async function sendSMS(to, message) {
    try {
        await smsClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        return true;
    }
    catch (error) {
        console.error('Failed to send SMS:', error);
        return false;
    }
}
