import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth:
        env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html, from }) {
  const tx = getTransporter();
  const info = await tx.sendMail({
    from: from || env.SMTP_FROM || env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return info;
}
