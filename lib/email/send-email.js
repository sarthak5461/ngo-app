import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
  attachments = [],
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const payload = {
    from: from || process.env.EMAIL_FROM,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
    ...(attachments?.length ? { attachments } : {}),
  };

  const result = await resend.emails.send(payload);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}