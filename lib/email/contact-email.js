import { sendAdminNotification } from "@/lib/email/admin-email";
import { sendUserConfirmation } from "@/lib/email/user-email";

export async function sendContactNotification(contact) {
  // ─────────────────────────────────────────────
  // ADMIN NOTIFICATION
  // ─────────────────────────────────────────────
  try {
    await sendAdminNotification({
      type: "Contact Form",
      title: `New Contact Message — ${contact.subject || "General Enquiry"}`,
      subject: `New Contact Message — ${contact.subject || "General Enquiry"}`,
      intro:
        "A new message has been submitted through the website contact form.",
      details: [
        ["Name", contact.name],
        ["Email", contact.email],
        ["Subject", contact.subject || "General Enquiry"],
      ],
      message: contact.message,
      replyTo: contact.email,
    });
  } catch (error) {
    console.error("CONTACT ADMIN EMAIL ERROR:", error);
  }

  // ─────────────────────────────────────────────
  // USER CONFIRMATION
  // ─────────────────────────────────────────────
  try {
    await sendUserConfirmation({
      to: contact.email,
      name: contact.name,
      title: "Thank You for Contacting Us",
      subject: "We received your message — Maa Karma Devi Sangh Trust",
      message:
        "Thank you for contacting Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust. We have successfully received your message. Our team will review your enquiry and get back to you within 24 hours.",
      details: [["Subject", contact.subject || "General Enquiry"]],
    });
  } catch (error) {
    console.error("CONTACT CONFIRMATION EMAIL ERROR:", error);
  }
}
