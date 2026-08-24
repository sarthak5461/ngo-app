import { sendEmail } from "@/lib/email/send-email";

import { emailLayout, detailTable, escapeHtml } from "./email-layout";

export async function sendAdminNotification({
  type,
  title,
  subject,
  intro,
  details = [],
  message,
  replyTo,
  attachments = [],
}) {
  const html = emailLayout({
    title,
    preheader: subject,

    children: `
      <h1 class="title">
        ${escapeHtml(title)}
      </h1>

      <p class="text">
        ${escapeHtml(intro || "")}
      </p>

      ${
        details.length
          ? `
            <div class="section">
              ${detailTable(details)}
            </div>
          `
          : ""
      }

      ${
        message
          ? `
            <div class="section">
              <h2 class="subtitle">Message</h2>
              <p class="text" style="white-space:pre-line;">
                ${escapeHtml(message)}
              </p>
            </div>
          `
          : ""
      }

      <p class="text" style="margin-top:28px;">
        <strong>${escapeHtml(type || "New Submission")}</strong>
      </p>
    `,
  });

  return sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
    replyTo,
    attachments,
  });
}
