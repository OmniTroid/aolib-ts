/**
 * Decode: wire string → typed packet.
 *
 * Auto-detects format from the first byte (`{` ⇒ JSON envelope; anything
 * else ⇒ fanta positional), runs the format-specific parser into a
 * partial object, and hands off to Ajv for validation + default-filling
 * via `./validate`.
 *
 * The fanta parser (`./fanta`) only owns string→typed token conversion
 * (number parse, boolean parse, etc.); range / type validation comes
 * from the JSON Schema via Ajv afterwards. The JSON parser is plain
 * `JSON.parse` — Ajv validates the result.
 *
 * Defensive checks:
 *   - JSON envelope `$header` must match `schema.$header` (Ajv enforces
 *     this via the schema's `$header` `const`).
 *   - Fanta wire header is checked before parsing args.
 */

import { fromFantaArgs } from "./fanta";
import { validate } from "./validate";
import type { Fields, Schema } from "./schema";

export function decode<F extends Fields>(
  schema: Schema<F>,
  wire: string,
): Record<string, unknown> {
  return wire.startsWith("{") ? decodeJson(schema, wire) : decodeFanta(schema, wire);
}

/**
 * Read the header from a wire frame without fully decoding the body.
 * Used by the session dispatcher to look up which schema to pass to
 * `decode`. Throws on malformed input (caller routes via the
 * `onMalformedFrame` hook).
 */
export function readHeader(wire: string): string {
  if (wire.startsWith("{")) {
    const parsed = JSON.parse(wire) as { $header?: unknown };
    if (typeof parsed.$header !== "string") {
      throw new Error(`JSON envelope missing $header string`);
    }
    return parsed.$header;
  }
  const idx = wire.indexOf("#");
  return idx === -1 ? wire : wire.slice(0, idx);
}

function decodeJson<F extends Fields>(
  schema: Schema<F>,
  wire: string,
): Record<string, unknown> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(wire) as Record<string, unknown>;
  } catch (err) {
    throw new Error(`Invalid JSON wire: ${(err as Error).message}`);
  }

  // Explicit check beats Ajv's generic const-violation error, and is
  // symmetric with the fanta path's own header check.
  if (parsed.$header !== schema.$header) {
    throw new Error(
      `Wire header mismatch: expected '${schema.$header}', got '${String(parsed.$header)}'`,
    );
  }

  validate(schema, parsed);
  delete parsed.$header;
  return parsed;
}

function decodeFanta<F extends Fields>(
  schema: Schema<F>,
  wire: string,
): Record<string, unknown> {
  // Peel terminator forms — accept canonical `HEADER#a#b#%`, plus the
  // legacy variants `HEADER#a#b#` and `HEADER#a#b`.
  let trimmed = wire;
  if (trimmed.endsWith("%")) trimmed = trimmed.slice(0, -1);
  if (trimmed.endsWith("#")) trimmed = trimmed.slice(0, -1);

  const all = trimmed.split("#");
  const wireHeader = all[0];
  if (wireHeader !== schema.$header) {
    throw new Error(
      `Wire header mismatch: expected '${schema.$header}', got '${String(wireHeader)}'`,
    );
  }
  const args = all.slice(1);

  // Schema-level override has precedence — used for packets whose
  // positional layout the default args walker can't express.
  const partial = schema.fromArgs
    ? schema.fromArgs(args)
    : fromFantaArgs(schema.fields, args);

  // Ajv requires `$header` to match the const; set, validate, strip.
  partial.$header = schema.$header;
  validate(schema, partial);
  delete partial.$header;
  return partial;
}
