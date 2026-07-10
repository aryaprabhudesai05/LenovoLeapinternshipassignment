import multer from "multer";

const storage = multer.memoryStorage();

const ALLOWED = [".pdf", ".doc", ".docx", ".txt", ".rtf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB (images can be larger than resumes)

function fileFilter(req, file, cb) {
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf("."));
  if (!ALLOWED.includes(ext)) {
    return cb(new Error("Unsupported file type. Please upload a PDF, DOC, DOCX, TXT, or an image (PNG/JPG)."), false);
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single("file");

// Wrapper so multer errors return JSON instead of HTML.
export function handleUpload(req, res, next) {
  uploadResume(req, res, (err) => {
    if (err) {
      const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({ error: "UploadError", message: err.message });
    }
    next();
  });
}
