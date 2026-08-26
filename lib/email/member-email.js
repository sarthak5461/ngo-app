import { sendAdminNotification } from "@/lib/email/admin-email";
import { sendUserConfirmation } from "@/lib/email/user-email";

export async function sendMemberNotification(member) {
  // --------------------------------------------------
  // MEMBERSHIP CARD URL
  // --------------------------------------------------

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://karmadevitrust.org";

  const cardUrl = `${baseUrl}/membership/card/${encodeURIComponent(
    member.memberId,
  )}`;

  // --------------------------------------------------
  // ADMIN NOTIFICATION
  // --------------------------------------------------

  try {
    await sendAdminNotification({
      type: "Membership",
      title: `New Membership — ${member.name}`,
      subject: `New Membership Activated — ${member.memberId}`,

      intro:
        "A new membership has been successfully activated after payment verification.",

      details: [
        ["Member ID", member.memberId],
        ["Receipt Number", member.receiptNumber],
        ["Member Name", member.name],
        ["Email", member.email],
        ["Mobile", member.mobile],
        ["Address", member.address],
        ["Occupation", member.occupation || "Not provided"],
        [
          "Membership Amount",
          `₹${Number(member.amount || 0).toLocaleString("en-IN")}`,
        ],
        ["Payment ID", member.paymentId],
        ["Valid From", formatDate(member.validFrom)],
        ["Valid Until", formatDate(member.validUntil)],
        ["Message", member.reason || "No message provided"],
      ],

      message:
        "The membership application has been successfully completed and the member is now active.",

      replyTo: member.email,
    });
  } catch (error) {
    console.error("MEMBER ADMIN EMAIL ERROR:", error);
  }

  // --------------------------------------------------
  // MEMBER CONFIRMATION
  // --------------------------------------------------

  try {
    await sendUserConfirmation({
      to: member.email,
      name: member.name,

      title: "Welcome to Maa Karma Devi Sangh Trust",

      subject: `Membership Activated — ${member.memberId}`,

      message:
        "Thank you for becoming a member of Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust. Your membership payment has been successfully verified and your membership is now active.",

      details: [
        ["Member ID", member.memberId],
        ["Receipt Number", member.receiptNumber],
        [
          "Membership Amount",
          `₹${Number(member.amount || 0).toLocaleString("en-IN")}`,
        ],
        ["Payment ID", member.paymentId],
        ["Valid From", formatDate(member.validFrom)],
        ["Valid Until", formatDate(member.validUntil)],
      ],

      // --------------------------------------------------
      // MEMBERSHIP CARD BUTTON
      // --------------------------------------------------

      actionUrl: cardUrl,
      actionLabel: "Download Membership Card",
    });
  } catch (error) {
    console.error("MEMBER USER EMAIL ERROR:", error);
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
