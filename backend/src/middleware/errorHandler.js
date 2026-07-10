// Centralized error handling middleware.
export function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.originalUrl} not found` });
}

// Patterns that indicate a model rejected image/vision input. Matches both the
// Google Gemini and the OpenAI SDK ("Cannot read <file> (this model does not
// support image input)") error shapes so the client gets a friendly notice
// instead of a hard 500.
function isImageUnsupportedError(err) {
  const m = (err?.message || String(err || "")).toLowerCase();
  return (
    m.includes("does not support image") ||
    (m.includes("image") && (m.includes("not support") || m.includes("unsupported") || m.includes("invalid"))) ||
    m.includes("this model does not support") ||
    m.includes("cannot read") && m.includes("image")
  );
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[error]", err.message);
  const status = err.status || err.statusCode || 500;

  // Image-input rejection: return 200 with a user-facing notice so the UI can
  // inform the user and continue, rather than failing the whole request.
  if (status === 500 && isImageUnsupportedError(err)) {
    return res.status(200).json({
      error: "ImageInputUnsupported",
      message:
        "This AI model doesn't support image input, so your resume image couldn't be analyzed directly. Please upload a PDF, DOC, or TXT resume for full analysis, or we'll use extracted text where possible.",
      notice:
        "This AI model doesn't support image input. Upload a PDF/DOC/TXT resume, or we'll analyze the extracted text instead.",
    });
  }

  res.status(status).json({
    error: err.name || "ServerError",
    message: err.message || "Internal Server Error",
  });
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}
