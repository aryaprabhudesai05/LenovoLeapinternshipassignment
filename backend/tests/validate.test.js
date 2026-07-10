import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, rules } from "../src/middleware/validate.js";
import { HttpError } from "../src/middleware/errorHandler.js";

function run(schema, body) {
  return new Promise((resolve) => {
    const req = { body, query: {}, params: {} };
    const next = (err) => resolve(err || null);
    validate(schema)(req, {}, next);
  });
}

test("passes a valid body", async () => {
  const err = await run(
    { body: { email: [rules.required, rules.isEmail] } },
    { email: "arya@example.com" }
  );
  assert.equal(err, null);
});

test("rejects an invalid email", async () => {
  const err = await run(
    { body: { email: [rules.required, rules.isEmail] } },
    { email: "not-an-email" }
  );
  assert.ok(err instanceof HttpError);
  assert.equal(err.status, 400);
});

test("reports a missing required field", async () => {
  const err = await run({ body: { name: [rules.required] } }, {});
  assert.ok(err instanceof HttpError);
  assert.match(err.message, /name/);
});

test("enforces minimum length", async () => {
  const err = await run({ body: { password: [rules.required, rules.minLength(6)] } }, { password: "123" });
  assert.ok(err instanceof HttpError);
});
