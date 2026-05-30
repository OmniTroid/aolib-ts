/**
 * Ajv-driven validation. The JSON Schema emitted by `./jsonSchema` is
 * the runtime contract; Ajv compiles it once per schema and we cache
 * the compiled validator on a WeakMap keyed by the Schema object.
 *
 * `validate(schema, value)` mutates `value` in place — Ajv fills
 * defaults and strips additional properties when configured. The same
 * compiled validator is used by both encode (pre-serialize) and decode
 * (post-parse) so the typed packet shape is identical on both ends.
 *
 * Errors come back as a single Error whose message lists each Ajv
 * issue with its instancePath; throwing matches the prior cast/json
 * walker behavior so the session-layer hooks (onDecodeError, etc.)
 * keep working without changes.
 */

import Ajv, { type ValidateFunction } from "ajv";
import type { Schema } from "./schema";
import { toJsonSchema } from "./jsonSchema";

const ajv = new Ajv({
  useDefaults: true,
  removeAdditional: true,
  coerceTypes: false,
  // The schema's $header is a `const`; Ajv's strict mode complains
  // about unused $schema/title keywords on draft-07 specs we emit.
  strict: false,
});

const cache = new WeakMap<Schema, ValidateFunction>();

function getValidator(schema: Schema): ValidateFunction {
  let v = cache.get(schema);
  if (!v) {
    v = ajv.compile(toJsonSchema(schema));
    cache.set(schema, v);
  }
  return v;
}

/**
 * Validate `value` against the schema's JSON Schema. Mutates the value:
 * fills defaults, removes additional properties. Throws if validation
 * fails after defaults are applied.
 *
 * The caller is responsible for `$header`: set it before calling for
 * the envelope to match the schema's `const` requirement; strip after.
 */
export function validate(
  schema: Schema,
  value: Record<string, unknown>,
): void {
  const v = getValidator(schema);
  if (!v(value)) {
    const errs = v.errors ?? [];
    const msg = errs
      .map((e) => `${e.instancePath || "/"} ${e.message ?? "invalid"}`)
      .join("; ");
    throw new Error(`Validation failed for ${schema.$header}: ${msg}`);
  }
}
