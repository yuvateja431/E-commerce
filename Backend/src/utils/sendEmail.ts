import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.email}`);
  } catch (error) {
    console.error("❌ Email sending failed. Logging to console instead:");
    console.log("-----------------------------------------");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log("Message:");
    console.log(options.message);
    console.log("-----------------------------------------");
    
    // In development, we don't want to block the flow if email fails
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️  Continuing flow because NODE_ENV is development");
      return;
    }
    throw error;
  }
};
