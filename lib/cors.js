const DEFAULT_ALLOWED_ORIGINS = [
  "https://karmadevitrust.org",
  "https://www.karmadevitrust.org",
];

function getAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGINS;

  if (!configuredOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function handleCORS(response, request) {
  const allowedOrigins = getAllowedOrigins();

  const requestOrigin = request?.headers.get("origin");

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    response.headers.set("Access-Control-Allow-Origin", requestOrigin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}
