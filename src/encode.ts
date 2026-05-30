/**
 * Encode: typed packet → wire string.
 *
 * Validation is delegated to Ajv via `validate(schema, ...)`: defaults
 * fill in, extras strip out, required-field misses throw. The library
 * itself only owns the two wire-format steps that Ajv can't express:
 *
 *   - JSON path: stringify the validated envelope.
 *   - Fanta path: walk the schema's field order, ask each field's
 *     `toFanta` codec for its positional token, frame with `HEADER#…#%`.
 *
 * Literals never appear in the typed packet (the JSON Schema omits
 * them) but the fanta walker re-injects them from the field definition,
 * since they are part of the wire shape.
 */

import { toFantaArgs } from "./fanta";
import { validate } from "./validate";
import type { Fields, Schema } from "./schema";

export type WireMode = "fanta" | "json";

export function encode<F extends Fields>(
  schema: Schema<F>,
  packet: Record<string, unknown>,
  mode: WireMode,
): string {
  // Ajv expects `$header` to be present (the JSON Schema declares it
  // `const`). `$header` first preserves the canonical envelope key order.
  const envelope: Record<string, unknown> = { $header: schema.$header, ...packet };
  validate(schema, envelope);

  if (mode === "json") {
    return JSON.stringify(envelope);
  }
  return encodeFanta(schema, envelope);
}

function encodeFanta<F extends Fields>(
  schema: Schema<F>,
  envelope: Record<string, unknown>,
): string {
  // Schema-level override takes precedence — used for packets whose
  // wire layout the default args walker can't express.
  const args = schema.toArgs
    ? schema.toArgs(envelope)
    : toFantaArgs(schema.fields, envelope);
  return frameFantaWire(schema.$header, args);
}

/**
 * `HEADER#a#b#%` for non-empty args, `HEADER#%` for zero args.
 * Spec-canonical — the trailing `%` is the wire terminator.
 */
function frameFantaWire(header: string, args: string[]): string {
  if (args.length === 0) return `${header}#%`;
  return `${header}#${args.join("#")}#%`;
}
