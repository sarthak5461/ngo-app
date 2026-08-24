import { sendAdminNotification } from "@/lib/email/admin-email";
import { sendUserConfirmation } from "@/lib/email/user-email";

export async function sendCSRNotification(inquiry) {
  try {
    await sendAdminNotification({
      type: "CSR Inquiry",
      title: `New CSR Inquiry — ${inquiry.company}`,
      subject: `New CSR Inquiry — ${inquiry.company}`,
      intro: "A new CSR partnership inquiry has been received.",
      details: [
        ["Company", inquiry.company],
        ["Contact Person", inquiry.name],
        ["Designation", inquiry.designation || "Not provided"],
        ["Email", inquiry.email],
        ["Phone", inquiry.phone || "Not provided"],
        ["Partnership Type", inquiry.interest || "Not specified"],
        ["Approx. Budget / Scale", inquiry.budget || "Not provided"],
      ],
      message: inquiry.message,
      replyTo: inquiry.email,
    });
  } catch (error) {
    console.error("CSR ADMIN EMAIL ERROR:", error);
  }

  try {
    await sendUserConfirmation({
      to: inquiry.email,
      name: inquiry.name,
      title: "Thank You for Your CSR Enquiry",
      subject: "Thank you for contacting Maa Karma Devi Sangh Trust",
      message:
        "We have successfully received your CSR partnership enquiry. Our team will review your requirements and one of our executives will get in touch with you soon.",
      details: [
        ["Company", inquiry.company],
        ["Partnership Type", inquiry.interest || "General"],
        ...(inquiry.designation ? [["Designation", inquiry.designation]] : []),
        ...(inquiry.budget ? [["Approx. Budget / Scale", inquiry.budget]] : []),
      ],
    });
  } catch (error) {
    console.error("CSR CONFIRMATION EMAIL ERROR:", error);
  }
}
