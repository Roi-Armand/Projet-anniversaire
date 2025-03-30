import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: `"Event Platform" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for registering with our Event Platform. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If you did not create an account, please ignore this email.</p>
          <p>If the button above doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send event registration confirmation
export const sendEventRegistrationEmail = async (email, firstName, eventTitle, eventDate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Event Platform" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Confirmed</h2>
          <p>Hello ${firstName},</p>
          <p>Your registration for <strong>${eventTitle}</strong> on ${new Date(eventDate).toLocaleDateString()} has been confirmed.</p>
          <p>We look forward to seeing you at the event!</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return true;
  } catch (error) {
    console.error('Error sending registration email:', error);
    return false;
  }
};

