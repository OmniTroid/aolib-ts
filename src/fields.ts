/**
 * Field primitives.
 *
 * A schema is a record of `Field`s. Each field carries:
 *   - a `kind` discriminator the fanta walker dispatches on
 *   - shape-specific metadata (inner field, default value, separator, etc.)
 *   - a phantom type parameter `T` so `In<S>` / `Out<S>` in `./types` can
 *     recover the value type via `infer T`
 *
 * Validation, default-filling, and required-checking are handled by Ajv
 * via the JSON Schema emitted from these fields (see `./jsonSchema`
 * and `./validate`). The fanta walker only handles wire format
 * conversion and dispatches on `kind` directly — no per-field codec
 * methods.
 *
 * Seven primitives cover every AO packet shape we've encountered:
 *
 *   str() / num() / bool()    required scalar (leaf kinds)
 *   opt(inner, default)       optional with default
 *   lit(value)                wire-only literal (hidden from caller)
 *   nested(subfields, sep?)   nested object; in fanta, sub-fields packed
 *                             into one positional slot with a separator;
 *                             in JSON, a native nested object
 *   array(element)            variable-length list; in fanta, consumes
 *                             all remaining positional slots; in JSON, a
 *                             native array
 *   custom({...})             escape hatch for one-off shapes; carries
 *                             its own fanta codecs since the walker has
 *                             no general dispatch for these
 *
 * Direction asymmetry (e.g. MS): two schemas, same header, different
 * fields. The library's registries put each in the correct namespace.
 */

/**
 * Granular discriminator. The fanta walker dispatches on this.
 */
export type FieldKind =
  | "string" | "number" | "boolean"
  | "optional" | "literal"
  | "nested" | "array"
  | "custom";

/**
 * Base field interface. The phantom `__t` is what lets `In<S>` /
 * `Out<S>` recover the value type via `infer T`. Never set at runtime.
 */
export interface Field<T> {
  readonly kind: FieldKind;
  readonly __t?: T;
}

export interface ScalarField<T> extends Field<T> {
  readonly kind: "string" | "number" | "boolean";
}

export interface OptionalField<T> extends Field<T> {
  readonly kind: "optional";
  readonly inner: Field<T>;
  readonly default: T;
}

export interface LiteralField<T extends string | number | boolean> extends Field<T> {
  readonly kind: "literal";
  readonly value: T;
}

/**
 * Derives the value type of a nested field from its sub-fields' value
 * types — same pattern `In<S>` will use over a whole schema.
 */
export type NestedValue<S extends Record<string, Field<unknown>>> = {
  [K in keyof S]: S[K] extends Field<infer V> ? V : never;
};

export interface NestedField<S extends Record<string, Field<unknown>>>
  extends Field<NestedValue<S>>
{
  readonly kind: "nested";
  readonly subfields: S;
  /** Fanta-only: separator between sub-tokens. */
  readonly separator: string;
}

/**
 * `ArrayField` is parameterised by the element FIELD (not just its
 * value type), so `In<S>` / `Out<S>` can recurse into the element's
 * structure.
 */
export interface ArrayField<E extends Field<unknown>> extends Field<unknown[]> {
  readonly kind: "array";
  readonly element: E;
}

/**
 * Escape hatch for fields whose wire shape doesn't fit a primitive.
 * Carries its own fanta codecs since the walker has no general
 * dispatch. JSON validation comes from the optional `jsonSchema` field
 * read by `./jsonSchema`.
 */
export interface CustomField<T> extends Field<T> {
  readonly kind: "custom";
  fromFanta(token: string, name: string): T;
  toFanta(value: T): string;
}

// ---------------------------------------------------------------------
// Public constructors
// ---------------------------------------------------------------------

export function str(): ScalarField<string> {
  return { kind: "string" };
}

export function num(): ScalarField<number> {
  return { kind: "number" };
}

export function bool(): ScalarField<boolean> {
  return { kind: "boolean" };
}

/**
 * Mark a field as optional with a default. The default value is read by
 * `./jsonSchema` so Ajv fills it during validation.
 */
export function opt<T>(inner: Field<T>, defaultValue: T): OptionalField<T> {
  return { kind: "optional", inner, default: defaultValue };
}

/**
 * Wire-only positional literal — `lit(0)` for CC's leading `0`,
 * `lit("CID")` for PV's padding token. The fanta walker emits `value`
 * at this field's position on encode and skips the slot on decode.
 * `In<S>` and `Out<S>` strip this field, so it never appears on the
 * caller-facing API. Omitted from the JSON envelope.
 */
export function lit<T extends string | number | boolean>(
  value: T,
): LiteralField<T> {
  return { kind: "literal", value };
}

/**
 * Nested object field. In fanta, sub-fields are packed into one
 * positional slot, joined by `separator` (default `&`).
 *
 * Example: `offset: nested({ x: num(), y: num() })`
 *   fanta wire token: `5&3`
 *   JSON value:       `{ "x": 5, "y": 3 }`
 */
export function nested<S extends Record<string, Field<unknown>>>(
  subfields: S,
  separator: string = "&",
): NestedField<S> {
  return { kind: "nested", subfields, separator };
}

/**
 * Variable-length list field. In fanta, an array consumes all remaining
 * positional slots (greedy) — so an array field must be at the END of
 * the schema, and only one array field per schema. For multiple arrays
 * in one packet (rare), use a schema-level `toArgs`/`fromArgs` override.
 *
 * Example: `music_list: array(str())` (FM)
 *   fanta wire: `FM#track1#track2#track3#%`
 *   JSON value: `["track1", "track2", "track3"]`
 */
export function array<E extends Field<unknown>>(element: E): ArrayField<E> {
  return { kind: "array", element };
}

/**
 * Escape hatch for fields that don't fit any of the primitives. Define
 * the fanta codecs directly. Validation comes from Ajv if you attach a
 * `jsonSchema` property — see `./jsonSchema`.
 *
 * Most schemas should never need this — prefer adding a new primitive
 * if a pattern reappears across packets.
 */
export function custom<T>(codecs: {
  toFanta(value: T): string;
  fromFanta(token: string, name: string): T;
}): CustomField<T> {
  return { kind: "custom", ...codecs };
}
