// Lightweight security headers (helmet-like) implemented without external deps.
// Sets defensive HTTP headers on every response.
export function securityHeaders() {
  const isProd = process.env.NODE_ENV === "production";
  return function securityHeadersMiddleware(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    // Block injection of active content unless served from our own origin.
    res.setHeader(
      "Content-Security-Policy",
      isProd
        ? "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'"
        : "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; connect-src 'self' http://localhost:* ws://localhost:*"
    );
    res.setHeader(
      "Strict-Transport-Security",
      isProd ? "max-age=63072000; includeSubDomains; preload" : "max-age=0"
    );
    next();
  };
}

export default securityHeaders;
