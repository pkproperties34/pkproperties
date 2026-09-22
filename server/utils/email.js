import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `PK PROPERTIES <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Email could not be sent:', error);
    return false;
  }
};

export const sendOTPEmail = async (to, otp, purpose = 'Login') => {
  try {
    const mailOptions = {
      from: `PK PROPERTIES <${process.env.SMTP_USER}>`,
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
    };

    console.log(`\n======================================================`);
    console.log(`[Development Mode] OTP GENERATED FOR ${to}: ${otp}`);
    console.log(`======================================================\n`);

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Development] OTP email dispatched. MessageId: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('Error sending OTP via Nodemailer:', err);
    return false;
  }
};
