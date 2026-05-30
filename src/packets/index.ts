/**
 * Direction-keyed schema registries.
 *
 * `c2sSchemas` — packets a client sends and a server receives.
 * `s2cSchemas` — packets a server sends and a client receives.
 *
 * The same header may exist in both maps (e.g. `MC`, `CT`, `HP`,
 * `RT`, `ZZ`, `VS_JOIN`, `VS_LEAVE`, `VS_SPEAK` are bidirectional);
 * for symmetric packets the same schema constant is registered in
 * both maps, for asymmetric ones each direction picks its own.
 *
 * `const` assertions preserve the literal keys for session.ts's
 * mapped types — `aolib.server(...).send.<key>` is exactly typed.
 */

import {
  // c2s lifecycle
  HI, askchaa, RC, RD, RM, CH,
  // c2s gameplay
  CC,
  // c2s evidence
  AE, AM, AN, DE, EE, PE,
  // c2s moderation
  MA,
  // c2s voice
  VS_FRAME,
  // bidirectional (symmetric)
  HP, RT, ZZ,
  // s2c lifecycle
  decryptor, SI, DONE, CHECK,
  // s2c gameplay
  PV, BB, JD, TI, BN, SP,
  // s2c lists
  SC, SM, FM, FA, FL, CharsCheck, CI, EM, EI, LE, RMC,
  // s2c roster
  PN, PR, PU, ASS, AUTH,
  // s2c moderation
  BD, KB, KK,
  // s2c voice
  VS_AUDIO, VS_CAPS, VS_PEERS,
  // bidirectional voice signalling (asymmetric)
  VS_JOINRequest, VS_JOINBroadcast,
  VS_LEAVERequest, VS_LEAVEBroadcast,
  VS_SPEAKRequest, VS_SPEAKBroadcast,
} from "./simple";

import { MCRequest, MCBroadcast } from "./MC";
import { MSRequest, MSBroadcast } from "./MS";
import { CTRequest, CTBroadcast } from "./CT";
import { IDServer, IDClient } from "./ID";
import { ARUP } from "./ARUP";

export const c2sSchemas = {
  // handshake / lifecycle
  HI,
  ID: IDClient,
  askchaa,
  RC,
  RD,
  RM,
  CH,
  // gameplay
  CC,
  CT: CTRequest,
  MC: MCRequest,
  MS: MSRequest,
  HP,
  RT,
  ZZ,
  // evidence
  AE,
  AM,
  AN,
  DE,
  EE,
  PE,
  // moderation
  MA,
  // voice
  VS_FRAME,
  VS_JOIN: VS_JOINRequest,
  VS_LEAVE: VS_LEAVERequest,
  VS_SPEAK: VS_SPEAKRequest,
} as const;

export const s2cSchemas = {
  // handshake / lifecycle
  decryptor,
  ID: IDServer,
  SI,
  DONE,
  CHECK,
  // gameplay
  PV,
  BB,
  CT: CTBroadcast,
  MC: MCBroadcast,
  MS: MSBroadcast,
  HP,
  RT,
  ZZ,
  SP,
  JD,
  TI,
  BN,
  ASS,
  AUTH,
  ARUP,
  // lists / batches
  SM,
  FM,
  FA,
  FL,
  SC,
  CharsCheck,
  CI,
  EM,
  EI,
  LE,
  RMC,
  // player roster
  PN,
  PR,
  PU,
  // moderation
  BD,
  KB,
  KK,
  // voice
  VS_AUDIO,
  VS_CAPS,
  VS_PEERS,
  VS_JOIN: VS_JOINBroadcast,
  VS_LEAVE: VS_LEAVEBroadcast,
  VS_SPEAK: VS_SPEAKBroadcast,
} as const;

export type C2SSchemas = typeof c2sSchemas;
export type S2CSchemas = typeof s2cSchemas;

// ---------------------------------------------------------------------
// Re-export every schema constant for callers who want them by name.
// ---------------------------------------------------------------------

export * from "./simple";
export { MCRequest, MCBroadcast } from "./MC";
export { MSRequest, MSBroadcast } from "./MS";
export { CTRequest, CTBroadcast } from "./CT";
export { IDServer, IDClient } from "./ID";
export { ARUP } from "./ARUP";

// MS exposes the AO enums (Side, etc.) as the public type surface
// for callers — re-export them by name.
export {
  Side,
  DeskModifier,
  EmoteModifier,
  ShoutModifier,
  Flip,
  TextColor,
  isFullView,
  type Offset,
} from "./MS";

// ARUP exposes its discriminator enum and payload type.
export {
  AreaUpdateType,
  type AreaUpdateData,
} from "./ARUP";
