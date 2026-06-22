import isEmail from "validator/lib/isEmail";
import disposableDomains from "disposable-email-domains";
import dns from "node:dns/promises";

export async function validateEmail(email = "") {
  email = email.trim().toLowerCase();

  // Empty
  if (!email) {
    return {
      valid: false,
      message: "Email address is required.",
    };
  }

  // Format validation
  if (!isEmail(email)) {
    return {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }

  // Disposable email
  const domain = email.split("@")[1];

  // console.log("Checking domain:", domain);

  if (disposableDomains.includes(domain)) {
    return {
      valid: false,
      message: "Temporary email addresses are not allowed.",
    };
  }

  // DNS MX Record
  try {
    const mx = await dns.resolveMx(domain);

    // console.log("MX Records:", mx);

    if (!Array.isArray(mx) || mx.length === 0) {
      return {
        valid: false,
        message: "Email domain cannot receive emails.",
      };
    }

    mx.sort((a, b) => a.priority - b.priority);
  } catch (error) {
    // console.log("DNS ERROR:", error);

    return {
      valid: false,
      message: "Email domain does not exist.",
    };
  }

  return {
    valid: true,
    email,
  };
}
