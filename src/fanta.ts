/**
 * Fanta wire-format walker.
 *
 * Owns the args-list step: typed packet → ordered list of string tokens,
 * and back. The library handles framing (`HEADER#…#%`) and terminator
 * peeling in `./encode` and `./decode`.
 *
 * Validation, default-filling, and required-checking are Ajv's job
 * (via `./validate`); this walker only converts between the typed
 * value and its positional-token form.
 *
 * Per-field positional semantics:
 *
 *   string / number / boolean   one slot, codec inlined below
 *   optional                    one slot; absent slot → key omitted
 *                               (Ajv fills the default afterwards)
 *   literal                     one slot, emit the fixed value; on
 *                               decode consume the slot but don't store
 *   nested                      one slot, packed with separator
 *   array                       GREEDY: consumes all remaining slots
 *   custom                      one slot, codec from the field itself
 *
 * The chat-escape helpers are exported for the schema-level
 * `toArgs`/`fromArgs` overrides in packets like ARUP that consume the
 * args list manually.
 */

import type {
  Field,
  OptionalField,
  LiteralField,
  NestedField,
  ArrayField,
  CustomField,
} from "./fields";
import type { Fields } from "./schema";

// ---------------------------------------------------------------------
// Chat-escape helpers.
// ---------------------------------------------------------------------

/** Replace fanta meta-characters with their escape sequences. */
export function escapeFanta(s: string): string {
  return s
    .replaceAll("#", "<num>")
    .replaceAll("&", "<and>")
    .replaceAll("%", "<percent>")
    .replaceAll("$", "<dollar>");
}

/** Inverse of `escapeFanta`. */
export function unescapeFanta(s: string): string {
  return s
    .replaceAll("<num>", "#")
    .replaceAll("<and>", "&")
    .replaceAll("<percent>", "%")
    .replaceAll("<dollar>", "$");
}

/** Decode `\uXXXX` escapes the legacy clients emit in chat. */
export function unescapeUnicode(s: string): string {
  return s.replace(/\\u([\d\w]{1,})/gi, (_m: string, g: string) =>
    String.fromCharCode(parseInt(g, 16)),
  );
}

// ---------------------------------------------------------------------
// Per-field token codecs.
// ---------------------------------------------------------------------

function encodeToken(field: Field<unknown>, value: unknown): string {
  switch (field.kind) {
    case "string":
      return escapeFanta(value as string);
    case "number":
      return String(value);
    case "boolean":
      return value ? "1" : "0";
    case "optional":
      return encodeToken((field as OptionalField<unknown>).inner, value);
    case "literal": {
      const v = (field as LiteralField<string | number | boolean>).value;
      if (typeof v === "string") return escapeFanta(v);
      if (typeof v === "boolean") return v ? "1" : "0";
      return String(v);
    }
    case "nested": {
      const f = field as NestedField<Record<string, Field<unknown>>>;
      const obj = value as Record<string, unknown>;
      const parts: string[] = [];
      for (const [k, sub] of Object.entries(f.subfields)) {
        parts.push(encodeToken(sub, obj[k]));
      }
      return parts.join(f.separator);
    }
    case "custom":
      return (field as CustomField<unknown>).toFanta(value);
    case "array":
      throw new Error("encodeToken: array fields are handled at the walker level");
  }
}

function decodeToken(field: Field<unknown>, token: string, name: string): unknown {
  switch (field.kind) {
    case "string":
      return unescapeUnicode(unescapeFanta(token));
    case "number": {
      if (token === "") {
        throw new Error(`Invalid number for field '${name}': empty token`);
      }
      const n = Number(token);
      if (Number.isNaN(n)) {
        throw new Error(
          `Invalid number for field '${name}': ${JSON.stringify(token)}`,
        );
      }
      return n;
    }
    case "boolean": {
      if (token !== "0" && token !== "1") {
        throw new Error(
          `Invalid boolean for field '${name}': expected "0" or "1", got ${JSON.stringify(token)}`,
        );
      }
      return token === "1";
    }
    case "optional":
      return decodeToken((field as OptionalField<unknown>).inner, token, name);
    case "literal":
      // The wire delivers the literal at this position; we ignore the
      // token (Ajv-validated $header is the only literal that matters)
      // and the walker omits the key from the result.
      return undefined;
    case "nested": {
      const f = field as NestedField<Record<string, Field<unknown>>>;
      const parts = token.split(f.separator);
      const result: Record<string, unknown> = {};
      let i = 0;
      for (const [k, sub] of Object.entries(f.subfields)) {
        result[k] = decodeToken(sub, parts[i++] ?? "", `${name}.${k}`);
      }
      return result;
    }
    case "custom":
      return (field as CustomField<unknown>).fromFanta(token, name);
    case "array":
      throw new Error("decodeToken: array fields are handled at the walker level");
  }
}

// ---------------------------------------------------------------------
// Args-list walker.
// ---------------------------------------------------------------------

/**
 * Walk a schema's fields and emit the ordered positional args list.
 * `packet` arrives Ajv-validated (defaults filled, required present).
 */
export function toFantaArgs(
  fields: Fields,
  packet: Record<string, unknown>,
): string[] {
  const args: string[] = [];
  for (const [name, field] of Object.entries(fields)) {
    if (field.kind === "array") {
      const f = field as ArrayField<Field<unknown>>;
      const items = packet[name] as unknown[];
      for (const item of items) args.push(encodeToken(f.element, item));
      continue;
    }
    args.push(encodeToken(field, packet[name]));
  }
  return args;
}

/**
 * Walk a schema's fields and parse the ordered positional args list
 * into a partial typed packet. Ajv runs over the result afterwards to
 * fill optional defaults and enforce required.
 *
 * Literal slots are consumed without storing; arrays consume all
 * remaining slots; optionals omit their key when the wire ended early.
 */
export function fromFantaArgs(
  fields: Fields,
  args: string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let cursor = 0;

  for (const [name, field] of Object.entries(fields)) {
    if (field.kind === "array") {
      const f = field as ArrayField<Field<unknown>>;
      result[name] = args
        .slice(cursor)
        .map((token, i) => decodeToken(f.element, token, `${name}[${i}]`));
      cursor = args.length;
      continue;
    }

    const token = args[cursor++];
    if (token === undefined) continue; // Ajv fills the default / enforces required
    if (field.kind === "literal") continue; // consumed, not stored

    result[name] = decodeToken(field, token, name);
  }

  return result;
}
