export function handleCORS(response) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGINS || "*",
  );

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
