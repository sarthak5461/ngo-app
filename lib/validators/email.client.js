import isEmail from "validator/lib/isEmail";

export function validateEmail(email = "") {
  return isEmail(email.trim());
}
