import { sendAdminNotification } from "@/lib/email/admin-email";
import { sendUserConfirmation } from "@/lib/email/user-email";
import { generateDonationReceipt } from "@/lib/email/receipt-pdf";

export async function sendDonationNotification(donation) {
  const pdfBuffer = await generateDonationReceipt(donation);

  const attachment = {
    filename: `${donation.receiptNumber.replace(/\//g, "-")}.pdf`,
    content: pdfBuffer,
  };

  // --------------------------------------------------
  // ADMIN
  // --------------------------------------------------

  try {
    await sendAdminNotification({
      type: "Donation",
      title: "New Donation Received",
      subject: `New Donation — ${donation.receiptNumber}`,

      intro: "A new donation has been successfully received and verified.",

      details: [
        ["Receipt Number", donation.receiptNumber],
        ["Donor Name", donation.donorName],
        ["Donor Email", donation.donorEmail],
        ["Phone", donation.donorPhone || "Not provided"],
        ["PAN", donation.panNumber || "Not provided"],
        ["Amount", `${donation.currency} ${donation.amount}`],
        ["Cause", donation.cause || "General"],
        ["Payment ID", donation.paymentId],
        ["Order ID", donation.orderId],
      ],

      message: donation.donorMessage,
      replyTo: donation.donorEmail || undefined,
    });
  } catch (error) {
    console.error("DONATION ADMIN EMAIL ERROR:", error);
  }

  // --------------------------------------------------
  // DONOR
  // --------------------------------------------------

  if (donation.donorEmail) {
    try {
      await sendUserConfirmation({
        to: donation.donorEmail,
        name: donation.donorName,

        title: "Thank You for Your Donation",

        subject: `Donation Receipt — ${donation.receiptNumber}`,

        message:
          "Thank you for your generous contribution to Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust. Your donation has been successfully received.",

        details: [
          ["Receipt Number", donation.receiptNumber],
          ["Amount", `${donation.currency} ${donation.amount}`],
          ["Cause", donation.cause || "General"],
          ["Payment ID", donation.paymentId],
        ],

        attachments: [attachment],
      });
    } catch (error) {
      console.error("DONATION USER EMAIL ERROR:", error);
    }
  }
}
