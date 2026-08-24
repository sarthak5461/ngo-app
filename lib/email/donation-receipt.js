import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(amount) {
  return `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
}

export async function generateDonationReceiptPdf(donation) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595.28, 841.89]); // A4

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const {
    receiptNumber,
    createdAt,
    donorName,
    donorEmail,
    donorPhone,
    panNumber,
    cause,
    paymentId,
    amount,
  } = donation;

  const pageWidth = page.getWidth();

  let y = 790;

  // -----------------------------------------
  // HEADER
  // -----------------------------------------

  page.drawText("DONATION RECEIPT", {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0.05, 0.2, 0.35),
  });

  y -= 32;

  page.drawText(
    "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
    {
      x: 50,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.15, 0.15, 0.15),
      maxWidth: pageWidth - 100,
    },
  );

  y -= 22;

  page.drawText("12A & 80G Certified • Trust Reg: 432/2024", {
    x: 50,
    y,
    size: 9,
    font: regularFont,
    color: rgb(0.35, 0.35, 0.35),
  });

  // Divider
  y -= 20;

  page.drawLine({
    start: { x: 50, y },
    end: { x: pageWidth - 50, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 35;

  // -----------------------------------------
  // RECEIPT DETAILS
  // -----------------------------------------

  const rows = [
    ["Receipt Number", receiptNumber],
    ["Date", formatDate(createdAt)],
    ["Donor Name", donorName || "Anonymous"],
    ["Email", donorEmail || "-"],
    ["Phone", donorPhone || "-"],
    ["PAN", panNumber || "-"],
    ["Cause", formatCause(cause)],
    ["Payment ID", paymentId || "-"],
  ];

  for (const [label, value] of rows) {
    page.drawText(label, {
      x: 55,
      y,
      size: 10,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(String(value), {
      x: 210,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: pageWidth - 260,
    });

    y -= 27;
  }

  // -----------------------------------------
  // AMOUNT
  // -----------------------------------------

  y -= 8;

  page.drawLine({
    start: { x: 50, y },
    end: { x: pageWidth - 50, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 38;

  page.drawText("TOTAL DONATION", {
    x: 55,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(formatAmount(amount), {
    x: 390,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.5),
  });

  // -----------------------------------------
  // TAX INFORMATION
  // -----------------------------------------

  y -= 60;

  page.drawRectangle({
    x: 50,
    y: y - 45,
    width: pageWidth - 100,
    height: 55,
    color: rgb(1.0, 0.97, 0.9),
    borderColor: rgb(0.95, 0.75, 0.3),
    borderWidth: 1,
  });

  page.drawText(
    "This donation is eligible for tax deduction under Section 80G,",
    {
      x: 65,
      y: y - 12,
      size: 9,
      font: boldFont,
      color: rgb(0.35, 0.25, 0.05),
    },
  );

  page.drawText("subject to applicable provisions of the Income Tax Act.", {
    x: 65,
    y: y - 28,
    size: 9,
    font: regularFont,
    color: rgb(0.35, 0.25, 0.05),
  });

  // -----------------------------------------
  // THANK YOU
  // -----------------------------------------

  y -= 95;

  page.drawText("Thank you for your generous contribution.", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 22;

  page.drawText(
    "Your support helps us continue our work across communities in India.",
    {
      x: 50,
      y,
      size: 9,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    },
  );

  // -----------------------------------------
  // FOOTER
  // -----------------------------------------

  page.drawLine({
    start: { x: 50, y: 65 },
    end: { x: pageWidth - 50, y: 65 },
    thickness: 0.7,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText(
    "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
    {
      x: 50,
      y: 45,
      size: 7,
      font: regularFont,
      color: rgb(0.45, 0.45, 0.45),
    },
  );

  page.drawText("Thank you for standing with us.", {
    x: pageWidth - 190,
    y: 45,
    size: 7,
    font: regularFont,
    color: rgb(0.45, 0.45, 0.45),
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

function formatCause(cause = "") {
  if (!cause) return "General";

  return cause
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
