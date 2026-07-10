// Parses and clamps pagination query params (?page=&limit=).
export function parsePagination(req, defaults = { page: 1, limit: 50, maxLimit: 100 }) {
  const page = Math.max(1, parseInt(req.query.page, 10) || defaults.page);
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, parseInt(req.query.limit, 10) || defaults.limit)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Ensures every document exposes a stable string `id` (mock data uses `id`,
// Mongoose docs use `_id`) so the client can key lists consistently.
export function withId(doc) {
  const obj = typeof doc.toJSON === "function" ? doc.toJSON() : { ...doc };
  if (obj.id === undefined || obj.id === null) {
    obj.id = doc._id ? doc._id.toString() : undefined;
  }
  return obj;
}

export default parsePagination;
