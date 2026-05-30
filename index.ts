/**
 * Public entry point for aolib.
 *
 * Layers, top-down:
 *   - session: `server(config)` / `client(config)` — the role-typed
 *     dispatch surface. Most callers only need these.
 *   - schemas: each AO packet has a typed schema; both the constants
 *     and the direction-keyed registries are re-exported below.
 *   - encode / decode / cast: the wire-format primitives the session
 *     layer drives. Exposed so library consumers can implement their
 *     own dispatcher if they need to bypass the session abstraction.
 *   - fields: the schema-building DSL (`str`, `num`, `opt`, etc.).
 *   - types: `In<S>` / `Out<S>` for callers writing their own typed
 *     wrappers.
 *   - jsonSchema: `toJsonSchema(schema)` for documentation export.
 */

// ---------------------------------------------------------------------
// Session: the main public surface.
// ---------------------------------------------------------------------

export {
  server,
  client,
  type SessionConfig,
  type ServerSession,
  type ClientSession,
} from "./session";

import { server, client } from "./session";

/**
 * Convenience namespace so both `import { server, client }` and
 * `import { aolib }` styles work.
 */
export const aolib = { server, client };

// ---------------------------------------------------------------------
// Packet types and supporting enums.
//
// The direction-keyed registries (c2sSchemas / s2cSchemas) are the
// runtime source of truth for which packets can flow which way. The
// individual schema constants are NOT re-exported as values from this
// barrel — only as types via `./packetTypes`. Type-namespace `aolib.X`
// gives callers the decoded-packet shape for handler signatures; the
// underlying schema values stay internal to the session layer.
// ---------------------------------------------------------------------

export {
  c2sSchemas,
  s2cSchemas,
  type C2SSchemas,
  type S2CSchemas,
  // MS enums (public type surface for chat fields)
  Side,
  DeskModifier,
  EmoteModifier,
  ShoutModifier,
  Flip,
  TextColor,
  isFullView,
  type Offset,
  // ARUP discriminator
  AreaUpdateType,
  type AreaUpdateData,
} from "./packets";

// Typed-packet aliases — `aolib.MSBroadcast` (a type) instead of
// `Out<typeof MSBroadcast>` in handler signatures.
export type {
  ARUP, ASS, AUTH, BB, BD, BN, CC, CH, CHECK, CharsCheck, CI,
  DE, DONE, EE, EI, EM, FA, FL, FM, HI, HP, JD,
  KB, KK, LE, MA, PE, PN, PR, PU, PV, RC, RD, RM, RMC, RT,
  SC, SI, SM, SP, TI, VS_AUDIO, VS_CAPS, VS_FRAME, VS_PEERS, ZZ,
  askchaa, decryptor,
  IDServer, IDClient,
  MCBroadcast, MCRequest,
  MSBroadcast, MSRequest,
  CTBroadcast, CTRequest,
  VS_JOINBroadcast, VS_JOINRequest,
  VS_LEAVEBroadcast, VS_LEAVERequest,
  VS_SPEAKBroadcast, VS_SPEAKRequest,
} from "./packetTypes";

// ---------------------------------------------------------------------
// Field primitives (schema DSL).
// ---------------------------------------------------------------------

export {
  str,
  num,
  bool,
  opt,
  lit,
  nested,
  array,
  custom,
  type Field,
  type FieldKind,
  type ScalarField,
  type OptionalField,
  type LiteralField,
  type NestedField,
  type NestedValue,
  type ArrayField,
  type CustomField,
} from "./fields";

// ---------------------------------------------------------------------
// Wire-format primitives.
// ---------------------------------------------------------------------

export { encode, type WireMode } from "./encode";
export { decode, readHeader } from "./decode";
export { cast } from "./cast";

// Per-field walkers (lower-level — most callers won't need these).
export { fromJson, toJson } from "./json";
export { fromFantaArgs, toFantaArgs } from "./fanta";

// ---------------------------------------------------------------------
// Type-level walkers — `In<S>` (caller input shape) and `Out<S>`
// (decoded output shape). The only types client code should reach for.
// ---------------------------------------------------------------------

export type {
  In,
  Out,
  InFields,
  OutFields,
  FieldInValue,
  FieldOutValue,
} from "./types";

// ---------------------------------------------------------------------
// JSON Schema export for documentation / cross-language interop.
// ---------------------------------------------------------------------

export { toJsonSchema } from "./jsonSchema";

// ---------------------------------------------------------------------
// Schema builder.
// ---------------------------------------------------------------------

export {
  packet,
  type Fields,
  type Schema,
  type SchemaOverrides,
} from "./schema";
