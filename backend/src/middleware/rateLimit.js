// In-memory fixed-window rate limiter (no external deps).
// Suitable for single-instance deployments. For multi-instance / distributed
// setups swap this for a shared store (Redis) — the interface stays the same.
const windows = new Map();

function trim(now, windowMs) {
  for (const [key, bucket] of windows) {
    if (now - bucket.resetAt > windowMs) windows.delete(key);
  }
}

export function rateLimit({
  windowMs = 60 * 1000,
  max = 100,
  keyGenerator = (req) => req.ip || req.socket.remoteAddress || "unknown",
  message = "Too many requests, please try again later.",
} = {}) {
  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    if (windows.size > 10000) trim(now, windowMs);
    const key = `${keyGenerator(req)}:${req.route?.path || req.path}`;
    let bucket = windows.get(key);
    if (!bucket || now - bucket.resetAt > windowMs) {
      bucket = { count: 0, resetAt: now + windowMs };
      windows.set(key, bucket);
    }
    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    if (bucket.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({ error: "TooManyRequests", message });
    }
    next();
  };
}

export default rateLimit;
