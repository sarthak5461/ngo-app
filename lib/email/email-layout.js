const TRUST_NAME =
  "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust";

const WEBSITE_URL = "https://www.karmadevitrust.org";

const COLORS = {
  primary: "#0F4C81",
  primaryDark: "#0B3558",
  accent: "#F59E0B",
  text: "#334155",
  muted: "#64748B",
  light: "#F8FAFC",
  border: "#E2E8F0",
  success: "#059669",
  danger: "#DC2626",
};

export function emailLayout({
  title,
  preheader = "",
  children,
  footerText = "",
  admin = false,
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />

  <title>${escapeHtml(title)}</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: Arial, Helvetica, sans-serif;
      color: ${COLORS.text};
    }

    table {
      border-collapse: collapse;
    }

    img {
      border: 0;
      display: block;
      max-width: 100%;
    }

    a {
      color: ${COLORS.primary};
      text-decoration: none;
    }

    .wrapper {
      width: 100%;
      background: #f1f5f9;
      padding: 32px 12px;
    }

    .container {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
    }

    .header {
      background: ${COLORS.primary};
      padding: 28px 32px;
      text-align: center;
    }

    .brand {
      color: #ffffff;
      font-size: 21px;
      font-weight: 700;
      line-height: 1.4;
    }

    .brand-subtitle {
      color: rgba(255,255,255,0.75);
      font-size: 12px;
      margin-top: 5px;
    }

    .content {
      padding: 36px 32px;
    }

    .title {
      color: ${COLORS.primaryDark};
      font-size: 26px;
      line-height: 1.3;
      margin: 0 0 18px;
    }

    .text {
      font-size: 15px;
      line-height: 1.7;
      color: ${COLORS.text};
    }

    .muted {
      color: ${COLORS.muted};
    }

    .section {
      margin-top: 26px;
    }

    .section-title {
      color: ${COLORS.primaryDark};
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .details {
      width: 100%;
      border: 1px solid ${COLORS.border};
      border-radius: 10px;
      overflow: hidden;
    }

    .detail-row td {
      padding: 11px 14px;
      border-bottom: 1px solid ${COLORS.border};
      font-size: 14px;
      vertical-align: top;
    }

    .detail-row:last-child td {
      border-bottom: 0;
    }

    .detail-label {
      width: 34%;
      color: ${COLORS.muted};
      font-weight: 600;
    }

    .detail-value {
      color: ${COLORS.text};
    }

    .message-box {
      background: ${COLORS.light};
      border-left: 4px solid ${COLORS.primary};
      padding: 16px 18px;
      margin-top: 12px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      line-height: 1.7;
    }

    .success-box {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      padding: 16px;
      border-radius: 9px;
      margin: 22px 0;
    }

    .admin-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 16px;
      border-radius: 9px;
      margin-bottom: 24px;
    }

    .button {
      display: inline-block;
      background: ${COLORS.primary};
      color: #ffffff !important;
      padding: 12px 22px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      margin-top: 10px;
    }

    .footer {
      background: ${COLORS.light};
      border-top: 1px solid ${COLORS.border};
      padding: 24px 32px;
      text-align: center;
    }

    .footer-name {
      font-weight: 700;
      color: ${COLORS.primaryDark};
      font-size: 13px;
    }

    .footer-text {
      color: ${COLORS.muted};
      font-size: 12px;
      line-height: 1.6;
      margin-top: 6px;
    }

    .footer-link {
      color: ${COLORS.primary};
      font-weight: 600;
    }

    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 12px 6px;
      }

      .header {
        padding: 24px 20px;
      }

      .content {
        padding: 28px 20px;
      }

      .footer {
        padding: 20px;
      }

      .title {
        font-size: 23px;
      }

      .detail-label {
        width: 38%;
      }
    }
  </style>
</head>

<body>
  ${
    preheader
      ? `<div style="
          display:none;
          max-height:0;
          overflow:hidden;
          opacity:0;
          color:transparent;
        ">
        ${escapeHtml(preheader)}
      </div>`
      : ""
  }

  <table role="presentation" width="100%" class="wrapper">
    <tr>
      <td align="center">

        <table role="presentation" class="container">

          <!-- Header -->
          <tr>
            <td class="header">
              <div class="brand">
                ${TRUST_NAME}
              </div>

              <div class="brand-subtitle">
                Serving communities with care, dignity and purpose
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">

              ${children}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">

              <div class="footer-name">
                ${TRUST_NAME}
              </div>

              ${
                footerText ? `<div class="footer-text">${footerText}</div>` : ""
              }

              <div class="footer-text">
                <a
                  href="${WEBSITE_URL}"
                  class="footer-link"
                >
                  www.karmadevitrust.org
                </a>
              </div>

              <div class="footer-text">
                This is an automated email from the Trust website.
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function detailTable(rows = []) {
  return `
    <table role="presentation" class="details">
      ${rows
        .map(
          ([label, value]) => `
            <tr class="detail-row">
              <td class="detail-label">
                ${escapeHtml(label)}
              </td>
              <td class="detail-value">
                ${value || "—"}
              </td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

export function messageBox(message) {
  return `
    <div class="message-box">
      ${escapeHtml(message).replace(/\n/g, "<br />")}
    </div>
  `;
}

export function primaryButton(label, url) {
  return `
    <a href="${url}" class="button">
      ${escapeHtml(label)}
    </a>
  `;
}
