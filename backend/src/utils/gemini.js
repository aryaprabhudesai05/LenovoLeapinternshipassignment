import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

let client = null;
if (env.geminiApiKey) {
  client = new GoogleGenerativeAI(env.geminiApiKey);
}

const VISION_MODEL = "gemini-1.5-flash";
const TEXT_MODEL = "gemini-1.5-flash";

const VISION_CAPABLE = new Set([
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-vision-preview",
  "gpt-4-turbo",
]);

function isVisionCapable(model) {
  return VISION_CAPABLE.has((model || "").toLowerCase());
}

// Patterns that indicate the configured model rejected an image payload.
function isImageUnsupportedError(err) {
  const m = (err?.message || String(err || "")).toLowerCase();
  return (
    m.includes("does not support image") ||
    (m.includes("image") && (m.includes("not support") || m.includes("unsupported") || m.includes("invalid"))) ||
    m.includes("this model does not support")
  );
}

function extractJSON(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Best-effort OCR using tesseract.js (loaded lazily so the app still runs
// if the optional dependency is not installed). Returns "" on any failure.
async function extractTextViaOcr(buffer, mimeType = "image/png") {
  try {
    const mod = await import("tesseract.js");
    const Tesseract = mod.default || mod;
    const { data } = await Tesseract.recognize(Buffer.from(buffer), "eng", {
      mimeType,
    });
    return data?.text || "";
  } catch (e) {
    console.warn("[gemini] OCR unavailable:", e?.message || e);
    return "";
  }
}

// Best-effort PDF text extraction using pdf-parse (loaded lazily).
async function extractPdfText(buffer) {
  try {
    const mod = await import("pdf-parse");
    const pdfParse = mod.default || mod;
    const { text } = await pdfParse(Buffer.from(buffer));
    return text || "";
  } catch (e) {
    console.warn("[gemini] PDF text extraction unavailable:", e?.message || e);
    // Fall back to raw bytes — better than nothing for plain text content.
    return buffer.toString("utf8");
  }
}

// Detect the kind of uploaded file so we know how to feed it to the model.
export function detectFileKind(file) {
  const name = (file?.originalname || file?.name || "").toLowerCase();
  const mime = (file?.mimetype || "").toLowerCase();
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";

  if (mime.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"].includes(ext)) {
    return { kind: "image", mime: mime || "image/png", ext };
  }
  if (mime === "application/pdf" || ext === ".pdf") {
    return { kind: "pdf", mime: mime || "application/pdf", ext };
  }
  if ([".doc", ".docx", ".txt", ".rtf", ".odt"].includes(ext)) {
    return { kind: "text", mime: mime || "application/octet-stream", ext };
  }
  return { kind: "unknown", mime, ext };
}

export async function generateJSON(prompt, fallback) {
  if (env.useMockAi || !client) {
    return fallback;
  }
  try {
    const model = client.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(
      `${prompt}\n\nRespond ONLY with valid minified JSON, no markdown.`
    );
    const parsed = extractJSON(result.response.text());
    return parsed ?? fallback;
  } catch (err) {
    console.warn("[gemini] JSON generation failed, using fallback:", err.message);
    return fallback;
  }
}

export async function generateText(prompt, fallback) {
  if (env.useMockAi || !client) {
    return fallback;
  }
  try {
    const model = client.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text().trim() || fallback;
  } catch (err) {
    console.warn("[gemini] Text generation failed, using fallback:", err.message);
    return fallback;
  }
}

// Analyzes a resume from either extracted text, an image (via a vision-capable
// model), or a PDF. If the configured model cannot accept images, it falls
// back to OCR to extract text and then analyzes the text only. Always returns
// `fallback` instead of throwing so the caller never crashes.
export async function generateResumeAnalysis(prompt, opts = {}) {
  const { imageBuffer, mimeType = "image/png", text = "", fallback } = opts;

  if (env.useMockAi || !client) {
    return fallback;
  }

  // Top-level guard: no matter what the model/SDK throws (including
  // "this model does not support image input" or a file-read failure), we
  // always return a usable result instead of crashing the request.
  try {
  // Path 1: text already extracted (txt/doc/pdf) — straightforward.
  if (text && !imageBuffer) {
    try {
      return await generateJSON(`${prompt}\n\nResume text:\n${text.slice(0, 6000)}`, fallback);
    } catch (err) {
      console.warn("[gemini] analysis failed, using fallback:", err.message);
      return fallback;
    }
  }

  // Path 2: image input.
  if (imageBuffer) {
    // Notice shown to the user when the configured model cannot accept the
    // image directly. We still try OCR so the resume is not lost.
    const imageNotice =
      "This model doesn't support image input, so your resume image was analyzed using extracted text (OCR) instead of direct vision.";

    const model = client.getGenerativeModel({ model: VISION_MODEL });
    const canUseVision = isVisionCapable(VISION_MODEL);

    // Only attach the image if the model can actually handle it.
    if (canUseVision) {
      try {
        const result = await model.generateContent([
          { inlineData: { data: Buffer.from(imageBuffer).toString("base64"), mimeType } },
          { text: `${prompt}\n\nRespond ONLY with valid minified JSON, no markdown.` },
        ]);
        const parsed = extractJSON(result.response.text());
        if (parsed) return parsed;
      } catch (err) {
        if (isImageUnsupportedError(err)) {
          // Model rejected the image payload — fall back to OCR below.
          console.warn("[gemini] model rejected image input, falling back to OCR:", err.message);
        } else {
          console.warn("[gemini] vision analysis failed, attempting OCR:", err.message);
        }
      }
    }

    // OCR fallback: extract text from the image, then analyze the text.
    const ocrText = await extractTextViaOcr(imageBuffer, mimeType);
    if (ocrText.trim()) {
      try {
        const parsed = await generateJSON(
          `${prompt}\n\nResume text (extracted via OCR):\n${ocrText.slice(0, 6000)}`,
          fallback
        );
        // Preserve any user-facing notice alongside the analysis.
        return { ...parsed, notice: imageNotice };
      } catch (err) {
        console.warn("[gemini] OCR analysis failed, using fallback:", err.message);
        return { ...fallback, notice: imageNotice };
      }
    }

    // Could not read the image at all — inform the user and return fallback.
    console.warn("[gemini] no text could be read from image, using fallback");
    return {
      ...fallback,
      notice:
        "We couldn't read any text from the uploaded image. Please upload a clearer image, a PDF, or a DOC/TXT file so we can analyze your resume.",
    };
  }

  // Path 3: no text, no image — infer from the candidate profile.
  try {
    return await generateJSON(
      `${prompt}\n\nNo text provided; infer from the candidate profile.\n\nRespond ONLY with valid minified JSON, no markdown.`,
      fallback
    );
  } catch (err) {
    console.warn("[gemini] analysis failed, using fallback:", err.message);
    return fallback;
  }
  } catch (err) {
    // Final safety net: never propagate an image/SDK error to the client.
    console.warn("[gemini] resume analysis crashed, returning fallback:", err?.message || err);
    const unsupported = isImageUnsupportedError(err);
    return {
      ...fallback,
      notice: unsupported
        ? "This AI model doesn't support image input, so we couldn't analyze your resume image. Please upload a PDF, DOC, or TXT resume for full analysis."
        : "We couldn't analyze the resume with the AI model right now. Showing a preliminary result based on your profile.",
    };
  }
}

export { extractPdfText, VISION_MODEL, TEXT_MODEL };
export default { generateJSON, generateText, generateResumeAnalysis, detectFileKind };
