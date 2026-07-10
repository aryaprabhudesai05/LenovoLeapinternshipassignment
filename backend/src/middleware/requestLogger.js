// Structured request logger (morgan-like) without external dependencies.
// Logs method, path, status code, duration and client IP in a single line.
const LEVEL = { 2: "WARN", 3: "WARN", 4: "ERROR", 5: "ERROR" };

export function requestLogger(options = {}) {
  const skip = options.skip || ((req) => req.path === "/health");
  return function requestLoggerMiddleware(req, res, next) {
    if (skip(req)) return next();
    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      const status = res.statusCode;
      const level = LEVEL[Math.floor(status / 100)] || "INFO";
      const line = `[${level}] ${req.method} ${req.originalUrl} ${status} ${ms.toFixed(1)}ms ${req.ip || ""}`.trim();
      if (status >= 500) console.error(line);
      else console.log(line);
    });
    next();
  };
}

export default requestLogger;
