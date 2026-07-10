import { HttpError } from "../middleware/errorHandler.js";

// ----- Built-in validation rules (return error message string or null) -----
export const rules = {
  required: (v) =>
    v === undefined || v === null || v === "" ? "is required" : null,
  isString: (v) => (v !== undefined && typeof v !== "string" ? "must be a string" : null),
  isEmail: (v) =>
    v !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))
      ? "must be a valid email"
      : null,
  minLength: (n) => (v) =>
    v !== undefined && String(v).length < n ? `must be at least ${n} characters` : null,
  maxLength: (n) => (v) =>
    v !== undefined && String(v).length > n ? `must be at most ${n} characters` : null,
  isIn: (allowed) => (v) =>
    v !== undefined && !allowed.includes(v) ? `must be one of: ${allowed.join(", ")}` : null,
  isArray: (v) => (v !== undefined && !Array.isArray(v) ? "must be an array" : null),
};

function runField(value, fieldRules) {
  for (const rule of fieldRules) {
    const msg = rule(value);
    if (msg) return msg;
  }
  return null;
}

// validate({ body: { email: [rules.required, rules.isEmail] } })
export function validate(schema = {}) {
  return function validateMiddleware(req, res, next) {
    const errors = [];
    for (const [location, fields] of Object.entries(schema)) {
      const source = req[location] || {};
      for (const [field, fieldRules] of Object.entries(fields)) {
        const msg = runField(source[field], fieldRules);
        if (msg) errors.push({ field: `${location}.${field}`, message: `${field} ${msg}` });
      }
    }
    if (errors.length) {
      return next(new HttpError(400, `Validation failed: ${errors.map((e) => e.message).join("; ")}`));
    }
    next();
  };
}

export default validate;
