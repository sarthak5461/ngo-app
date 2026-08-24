import { sendEmail } from "@/lib/email/send-email";

import {
  emailLayout,
  detailTable,
  escapeHtml,
  primaryButton,
} from "./email-layout";

export async function sendUserConfirmation({
  to,
  name,
  title,
  subject,
  message,
  details = [],
  actionUrl,
  actionLabel,
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
        Dear <strong>${escapeHtml(name || "Supporter")}</strong>,
      </p>

      <p class="text">
        ${escapeHtml(message)}
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
        actionUrl
          ? `
            <div style="margin-top:26px;">
              ${primaryButton(actionLabel, actionUrl)}
            </div>
          `
          : ""
      }

      <p class="text" style="margin-top:28px;">
        With gratitude,<br />
        <strong>
          Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust
        </strong>
      </p>
    `,
  });

  return sendEmail({
    to,
    subject,
    html,
    attachments,
  });
}
