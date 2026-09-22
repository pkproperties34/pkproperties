import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend safely to prevent server crash if env var is missing on Render
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
if (!resend) {
  console.warn('WARNING: RESEND_API_KEY is missing. Email dispatch will be disabled.');
}

export const sendEmail = async (options) => {
  try {
    if (!resend) throw new Error('Resend is not configured');
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });
    console.log('Message sent via Resend:', data.id);
    return true;
  } catch (error) {
    console.error('Email could not be sent via Resend:', error);
    return false;
  }
};

export const sendOTPEmail = async (to, otp, purpose = 'Login') => {
  try {
    if (!resend) throw new Error('Resend is not configured');
    console.log(`\n======================================================`);
    console.log(`[Development Mode] OTP GENERATED FOR ${to}: ${otp}`);
    console.log(`======================================================\n`);

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject: `Your PK Properties ${purpose} OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">PK Properties Admin Portal</h2>
          <p style="color: #555; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">Here is your One-Time Password (OTP) for <strong>${purpose}</strong>:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a; padding: 15px 30px; background-color: #f5f5f5; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="color: #555; font-size: 16px;">This OTP is valid for 15 minutes. Do not share this code with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });
    
    console.log(`[Production] OTP email dispatched via Resend. MessageId: ${data?.id}`);
    return true;
  } catch (err) {
    console.error('Error sending OTP via Resend:', err);
    return false;
  }
};
