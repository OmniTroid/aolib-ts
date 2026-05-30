/**
 * Public typed-packet aliases.
 *
 * For every packet header `X` the library exposes a type `X` whose
 * shape matches the schema's decoded form (`Out<typeof X>`). The type
 * coexists with the schema constant of the same name — TypeScript
 * keeps them in separate namespaces, the way a `class` declaration
 * does.
 *
 * Asymmetric bidirectional packets (the c2s vs s2c shapes diverge)
 * keep their `Request` / `Broadcast` qualifiers so the direction is
 * legible at the call site:
 *   `MSRequest`   — validated against the client→server schema
 *   `MSBroadcast` — validated against the server→client schema
 *
 * Send sites don't need typed input aliases —
 * `client.server.send.X({...})` infers the input shape directly from
 * the schema.
 *
 * Schemas are imported under `s.X` so the declared `type X = ...`
 * doesn't shadow the schema name within its own RHS.
 */

import type { Out } from "./types";
import type * as s from "./packets";

// ---------------------------------------------------------------------
// Unidirectional and symmetric-bidirectional packets.
// ---------------------------------------------------------------------

export type ARUP = Out<typeof s.ARUP>;
export type ASS = Out<typeof s.ASS>;
export type AUTH = Out<typeof s.AUTH>;
export type BB = Out<typeof s.BB>;
export type BD = Out<typeof s.BD>;
export type BN = Out<typeof s.BN>;
export type CC = Out<typeof s.CC>;
export type CH = Out<typeof s.CH>;
export type CHECK = Out<typeof s.CHECK>;
export type CharsCheck = Out<typeof s.CharsCheck>;
export type CI = Out<typeof s.CI>;
export type DE = Out<typeof s.DE>;
export type DONE = Out<typeof s.DONE>;
export type EE = Out<typeof s.EE>;
export type EI = Out<typeof s.EI>;
export type EM = Out<typeof s.EM>;
export type FA = Out<typeof s.FA>;
export type FL = Out<typeof s.FL>;
export type FM = Out<typeof s.FM>;
export type HI = Out<typeof s.HI>;
export type HP = Out<typeof s.HP>;
export type JD = Out<typeof s.JD>;
export type KB = Out<typeof s.KB>;
export type KK = Out<typeof s.KK>;
export type LE = Out<typeof s.LE>;
export type MA = Out<typeof s.MA>;
export type PE = Out<typeof s.PE>;
export type PN = Out<typeof s.PN>;
export type PR = Out<typeof s.PR>;
export type PU = Out<typeof s.PU>;
export type PV = Out<typeof s.PV>;
export type RC = Out<typeof s.RC>;
export type RD = Out<typeof s.RD>;
export type RM = Out<typeof s.RM>;
export type RMC = Out<typeof s.RMC>;
export type RT = Out<typeof s.RT>;
export type SC = Out<typeof s.SC>;
export type SI = Out<typeof s.SI>;
export type SM = Out<typeof s.SM>;
export type SP = Out<typeof s.SP>;
export type TI = Out<typeof s.TI>;
export type VS_AUDIO = Out<typeof s.VS_AUDIO>;
export type VS_CAPS = Out<typeof s.VS_CAPS>;
export type VS_FRAME = Out<typeof s.VS_FRAME>;
export type VS_PEERS = Out<typeof s.VS_PEERS>;
export type ZZ = Out<typeof s.ZZ>;
export type askchaa = Out<typeof s.askchaa>;
export type decryptor = Out<typeof s.decryptor>;

// ---------------------------------------------------------------------
// Asymmetric bidirectional packets.
//
// `XRequest` validates against the client→server schema, `XBroadcast`
// against the server→client schema. ID's two sides are named by who
// owns the identity instead — IDServer / IDClient.
// ---------------------------------------------------------------------

export type IDServer = Out<typeof s.IDServer>;
export type IDClient = Out<typeof s.IDClient>;

export type MCRequest = Out<typeof s.MCRequest>;
export type MCBroadcast = Out<typeof s.MCBroadcast>;

export type MSRequest = Out<typeof s.MSRequest>;
export type MSBroadcast = Out<typeof s.MSBroadcast>;

export type CTRequest = Out<typeof s.CTRequest>;
export type CTBroadcast = Out<typeof s.CTBroadcast>;

export type VS_JOINRequest = Out<typeof s.VS_JOINRequest>;
export type VS_JOINBroadcast = Out<typeof s.VS_JOINBroadcast>;

export type VS_LEAVERequest = Out<typeof s.VS_LEAVERequest>;
export type VS_LEAVEBroadcast = Out<typeof s.VS_LEAVEBroadcast>;

export type VS_SPEAKRequest = Out<typeof s.VS_SPEAKRequest>;
export type VS_SPEAKBroadcast = Out<typeof s.VS_SPEAKBroadcast>;
