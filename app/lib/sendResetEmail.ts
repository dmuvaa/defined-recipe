import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your SMTP username
      pass: process.env.SMTP_PASSWORD, // your SMTP password
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Your App Name" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Password Reset Request', // Subject line
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send reset email');
  }
}
