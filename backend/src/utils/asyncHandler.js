import { HttpError } from "../middleware/errorHandler.js";

// Wraps an async route handler so thrown/rejected errors are forwarded to the
// central error handler instead of crashing the process.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
