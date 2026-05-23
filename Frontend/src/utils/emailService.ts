import nodemailer from 'nodemailer';
import { Order } from '@prisma/client';

export const sendOrderConfirmation = async ({
  to,
  order,
}: { to: string; order: Order }) => {
  // Simple nodemailer example; replace with SendGrid if desired
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject: `Your Order ${order.id} Confirmation`,
    html: `<p>Thank you for your purchase! Your order ID is <strong>${order.id}</strong>.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
