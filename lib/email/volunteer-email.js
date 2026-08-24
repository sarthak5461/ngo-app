import { sendAdminNotification } from "@/lib/email/admin-email";
import { sendUserConfirmation } from "@/lib/email/user-email";

export async function sendVolunteerNotification(volunteer) {
  try {
    await sendAdminNotification({
      type: "Volunteer Application",
      title: `New Volunteer Application — ${volunteer.name}`,
      subject: `New Volunteer Application — ${volunteer.name}`,
      intro:
        "A new volunteer application has been submitted through the Trust website.",
      details: [
        ["Name", volunteer.name],
        ["Email", volunteer.email],
        ["Phone", volunteer.phone || "Not provided"],
        ["City", volunteer.city || "Not provided"],
        ["Area of Interest", volunteer.interest || "General"],
      ],
      message: volunteer.message,
      replyTo: volunteer.email,
    });
  } catch (error) {
    console.error("VOLUNTEER ADMIN EMAIL ERROR:", error);
  }

  try {
    await sendUserConfirmation({
      to: volunteer.email,
      name: volunteer.name,
      title: "Thank You for Volunteering",
      subject: "Thank you for volunteering with Maa Karma Devi Sangh Trust",
      message:
        "We have successfully received your volunteer application. Our team will review your details and get in touch with you within 48 hours.",
      details: [
        ["Area of Interest", volunteer.interest || "General"],
        ...(volunteer.city ? [["City", volunteer.city]] : []),
      ],
    });
  } catch (error) {
    console.error("VOLUNTEER CONFIRMATION EMAIL ERROR:", error);
  }
}
