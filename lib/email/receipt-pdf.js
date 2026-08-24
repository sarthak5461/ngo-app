import PDFDocument from "pdfkit";

function formatAmount(amount, currency = "INR") {
  const value = Number(amount || 0).toLocaleString("en-IN");
  return `${currency} ${value}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function safe(value, fallback = "Not provided") {
  return value !== undefined && value !== null && String(value).trim() !== ""
    ? String(value)
    : fallback;
}

function formatCause(cause) {
  return safe(cause, "General")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function drawDivider(doc, y) {
  doc.moveTo(55, y).lineTo(540, y).strokeColor("#e2e8f0").lineWidth(1).stroke();
}

function drawInfoRow(doc, label, value, y, options = {}) {
  const {
    valueFont = "Helvetica",
    valueSize = 10.5,
    labelWidth = 125,
  } = options;

  const leftX = 70;
  const rightX = 195;
  const rightWidth = 335;

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor("#64748b")
    .text(label, leftX, y, {
      width: labelWidth,
    });

  doc
    .font(valueFont)
    .fontSize(valueSize)
    .fillColor("#1e293b")
    .text(value, rightX, y, {
      width: rightWidth,
      align: "right",
    });

  return Math.max(
    doc.heightOfString(value, {
      width: rightWidth,
      font: valueFont,
      size: valueSize,
    }),
    16,
  );
}

export function generateDonationReceipt(donation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Donation Receipt ${safe(donation.receiptNumber)}`,
          Author:
            "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
          Subject: "Donation Receipt",
        },
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      // --------------------------------------------------
      // PAGE CONSTANTS
      // --------------------------------------------------

      const pageWidth = doc.page.width;
      const contentLeft = 55;
      const contentWidth = pageWidth - 110;

      // --------------------------------------------------
      // HEADER
      // --------------------------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#0f172a")
        .text("DONATION RECEIPT", contentLeft, 65, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(13.5)
        .fillColor("#334155")
        .text("SHREE JAGANNATH SWAMI BHAKT SHIROMADI", contentLeft, 100, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#334155")
        .text("MAA KARMA DEVI SANGH TRUST", contentLeft, 120, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("12A & 80G Certified • Trust Reg: 432/2024", contentLeft, 143, {
          width: contentWidth,
          align: "center",
        });

      drawDivider(doc, 170);

      // --------------------------------------------------
      // RECEIPT NUMBER / DATE
      // --------------------------------------------------

      let y = 195;

      y += drawInfoRow(doc, "Receipt No.", safe(donation.receiptNumber), y, {
        valueFont: "Helvetica-Bold",
        valueSize: 10.5,
      });

      y += 14;

      y += drawInfoRow(doc, "Date", formatDate(donation.createdAt), y);

      y += 30;

      // --------------------------------------------------
      // DONOR INFORMATION
      // --------------------------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#0f172a")
        .text("Donor Information", contentLeft, y);

      y += 25;

      y += drawInfoRow(doc, "Donor", safe(donation.donorName, "Anonymous"), y, {
        valueFont: "Helvetica-Bold",
      });

      y += 12;

      y += drawInfoRow(doc, "Email", safe(donation.donorEmail), y);

      if (donation.donorPhone) {
        y += 12;

        y += drawInfoRow(doc, "Phone", donation.donorPhone, y);
      }

      if (donation.panNumber) {
        y += 12;

        y += drawInfoRow(doc, "PAN", donation.panNumber, y, {
          valueFont: "Helvetica-Bold",
        });
      }

      y += 30;

      // ==================================================
      // DONATION DETAILS
      // ==================================================

      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#111111")
        .text("Donation Details", 70, y);

      y += 18;

      const boxX = 65;
      const boxWidth = 470;
      const labelX = boxX + 18;
      const valueX = boxX + 145;
      const valueWidth = boxWidth - 165;

      const details = [
        ["Cause", safe(donation.cause, "General")],
        ["Payment ID", safe(donation.paymentId)],
        ["Currency", donation.currency || "INR"],
      ];

      const rowHeight = 29;
      const amountRowHeight = 38;
      const boxHeight = details.length * rowHeight + amountRowHeight + 20;

      // Background box
      doc
        .roundedRect(boxX, y, boxWidth, boxHeight, 8)
        .fillColor("#f5f7fa")
        .fill();

      // Border
      doc
        .roundedRect(boxX, y, boxWidth, boxHeight, 8)
        .lineWidth(1)
        .strokeColor("#dfe5ec")
        .stroke();

      let rowY = y + 16;

      details.forEach(([label, value]) => {
        doc
          .font("Helvetica")
          .fontSize(10.5)
          .fillColor("#64748b")
          .text(label, labelX, rowY, {
            width: 115,
            lineBreak: false,
          });

        doc
          .font("Helvetica-Bold")
          .fontSize(10.5)
          .fillColor("#1e293b")
          .text(value, valueX, rowY, {
            width: valueWidth,
            align: "right",
            lineBreak: false,
            ellipsis: true,
          });

        rowY += rowHeight;
      });

      // Divider before total
      doc
        .moveTo(labelX, rowY - 5)
        .lineTo(boxX + boxWidth - 18, rowY - 5)
        .lineWidth(0.7)
        .strokeColor("#d8dee7")
        .stroke();

      // Total
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#475569")
        .text("Total", labelX, rowY + 8, {
          width: 115,
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(17)
        .fillColor("#1e3a8a")
        .text(
          formatAmount(donation.amount, donation.currency || "INR"),
          valueX,
          rowY + 4,
          {
            width: valueWidth,
            align: "right",
            lineBreak: false,
          },
        );

      y += boxHeight + 35;

      // --------------------------------------------------
      // 80G / TAX NOTE
      // --------------------------------------------------

      const taxBoxHeight = 58;

      doc
        .roundedRect(contentLeft, y, contentWidth, taxBoxHeight, 8)
        .fillColor("#fffbeb")
        .fill();

      doc
        .roundedRect(contentLeft, y, contentWidth, taxBoxHeight, 8)
        .lineWidth(1)
        .strokeColor("#fde68a")
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#78350f")
        .text(
          "This contribution qualifies for tax deduction under ",
          contentLeft + 14,
          y + 17,
          {
            continued: true,
          },
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#78350f")
        .text("Section 80G", {
          continued: true,
        });

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#78350f")
        .text(" of the Income Tax Act, 1961.");

      y += taxBoxHeight + 30;

      // --------------------------------------------------
      // THANK YOU
      // --------------------------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#334155")
        .text("Thank you for your generosity.", contentLeft, y, {
          width: contentWidth,
          align: "center",
        });

      y += 22;

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#64748b")
        .text(
          "Your contribution helps Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust continue its work for communities across India.",
          contentLeft + 25,
          y,
          {
            width: contentWidth - 50,
            align: "center",
            lineGap: 3,
          },
        );

      // --------------------------------------------------
      // FOOTER
      // --------------------------------------------------

      const footerY = doc.page.height - 60;

      drawDivider(doc, footerY - 10);

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#94a3b8")
        .text(
          "This is an electronically generated donation receipt and does not require a physical signature.",
          contentLeft,
          footerY,
          {
            width: contentWidth,
            align: "center",
          },
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748b")
        .text(
          "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
          contentLeft,
          footerY + 16,
          {
            width: contentWidth,
            align: "center",
          },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
