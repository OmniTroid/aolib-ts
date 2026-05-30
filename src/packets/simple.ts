/**
 * Simple AO packet schemas — one or a handful of fields each, no
 * direction-asymmetric variants, no codec helpers worth a dedicated
 * file.
 *
 * Packets with substantial per-packet logic (MS, ARUP) or asymmetric
 * bidirectional shapes (MC, CT, ID, VS_JOIN, VS_LEAVE, VS_SPEAK) live
 * in their own files.
 *
 * Grouped roughly by purpose for readability; the order is documentation
 * only — `packets/index.ts` builds the wire registries in its own order.
 */

import { packet } from "../schema";
import {
  str, num, bool, opt, lit, nested, array, custom, type CustomField,
} from "../fields";
import { Side } from "./MS";

// ---------------------------------------------------------------------
// c2s — handshake / lifecycle
// ---------------------------------------------------------------------

/**
 * HI (c2s) — client identifies itself by hardware id. First packet
 * after the server's `decryptor`; `hdid` is used for ban lookup and
 * per-device rate limiting.
 */
export const HI = packet("HI", { hdid: str() });

/** askchaa (c2s) — request character list. Server responds with SI. */
export const askchaa = packet("askchaa", {});

/** RC (c2s) — request character list. Server responds with SC. */
export const RC = packet("RC", {});

/** RD (c2s) — handshake complete; server sends background + DONE. */
export const RD = packet("RD", {});

/** RM (c2s) — request music list. Server responds with SM. */
export const RM = packet("RM", {});

/** CH (c2s) — client keepalive ping; server replies with CHECK. */
export const CH = packet("CH", { char_id: num() });

// ---------------------------------------------------------------------
// c2s — gameplay
// ---------------------------------------------------------------------

/**
 * CC (c2s) — client requests a specific character slot.
 *
 * Wire shape is `CC#<player_id>#<char_id>#<char_password>#%`. The
 * leading slot echoes back the player id the server handed us in the
 * ID packet; `char_password` is the legacy character-claim password.
 */
export const CC = packet("CC", {
  player_id: num(),
  char_id: num(),
  char_password: opt(str(), ""),
});

// ---------------------------------------------------------------------
// c2s — evidence
// ---------------------------------------------------------------------

/** AE (c2s) — pagination cursor; ask for the next evidence item by id. */
export const AE = packet("AE", { id: num() });

/** AM (c2s) — pagination cursor; ask for the next music-list batch. */
export const AM = packet("AM", { batch: num() });

/** AN (c2s) — pagination cursor; ask for the next character-list batch. */
export const AN = packet("AN", { batch: num() });

/** DE (c2s) — delete an evidence item by id. Server broadcasts the result as LE. */
export const DE = packet("DE", { id: num() });

/** EE (c2s) — edit an existing evidence item. Server broadcasts the update as LE. */
export const EE = packet("EE", {
  id: num(),
  name: str(),
  description: str(),
  image: str(),
});

/** PE (c2s) — add an evidence item. Server broadcasts the updated list as LE. */
export const PE = packet("PE", {
  name: str(),
  description: str(),
  image: str(),
});

// ---------------------------------------------------------------------
// c2s — moderation
// ---------------------------------------------------------------------

/**
 * MA (c2s) — moderator action against a player (mute / ban / kick).
 * `duration` is in minutes; `0` means kick (no time-bound block).
 */
export const MA = packet("MA", {
  id: num(),
  duration: num(),
  reason: str(),
});

// ---------------------------------------------------------------------
// c2s — voice
// ---------------------------------------------------------------------

/**
 * VS_FRAME (c2s) — voice subsystem outbound frame. `payload` is
 * base64-encoded Opus; not chat-escaped and treated as opaque.
 */
export const VS_FRAME = packet("VS_FRAME", { payload: str() });

// ---------------------------------------------------------------------
// Bidirectional — same schema both ways
// ---------------------------------------------------------------------

/**
 * HP — health-bar update. `bar`: 1 = defense, otherwise prosecution.
 * `value`: integer 0..10 (×10 = percentage in current clients).
 */
export const HP = packet("HP", {
  bar: num(),
  value: num(),
});

/**
 * RT — testimony / judge-ruling state. `animation`: `"testimony1"`,
 * `"testimony2"`, or `"judgeruling"`. `judgeId` only meaningful when
 * `animation === "judgeruling"`; defaults to `-1`.
 */
export const RT = packet("RT", {
  animation: str(),
  judgeId: opt(num(), -1),
});

/**
 * ZZ — modcall. `target` is a non-spec AO2 extension carrying the
 * targeted player id (or `-1` for "any mod"); defaults to `-1`.
 */
export const ZZ = packet("ZZ", {
  reason: str(),
  target: opt(num(), -1),
});

// ---------------------------------------------------------------------
// s2c — handshake / lifecycle
// ---------------------------------------------------------------------

/**
 * decryptor (s2c) — server's first packet to a connecting client.
 * The `value` field is the legacy AO2 encryption key, repurposed in
 * modern (FANTA) deployments as a sentinel: `"FANTA"` keeps the
 * positional wire, `"JSON"` flips both sides to the JSON envelope.
 * Mode-flip is implemented session-side.
 */
export const decryptor = packet("decryptor", { value: str() });

/**
 * SI (s2c) — server info (counts only). Triggers the client to start
 * the character / evidence / music download sequence (RC / RD / RM).
 */
export const SI = packet("SI", {
  char_count: num(),
  evi_count: num(),
  mus_count: num(),
});

/**
 * DONE (s2c) — server signals end of the handshake / area-list
 * sequence. Zero-field marker; wire is `DONE#%`.
 */
export const DONE = packet("DONE", {});

/** CHECK (s2c) — server keepalive ack, empty payload. */
export const CHECK = packet("CHECK", {});

// ---------------------------------------------------------------------
// s2c — gameplay state
// ---------------------------------------------------------------------

/**
 * PV (s2c) — server confirms a character pick. Wire is
 * `PV#<player_id>#CID#<char_id>#%`; `CID` is a literal padding slot
 * stripped from the typed API.
 */
export const PV = packet("PV", {
  player_id: num(),
  _cid: lit("CID"),
  char_id: num(),
});

/**
 * BB (s2c) — server pops a modal warning on the client. Used for
 * kicks, soft warnings, and other blocking server-to-client messages.
 */
export const BB = packet("BB", { message: str() });

/** JD (s2c) — toggle judge action panel; 1 = show, anything else = hide. */
export const JD = packet("JD", { state: num() });

/**
 * TI (s2c) — timer update. `command`: 0/1 = set time, 2 = show,
 * 3 = hide. `time` is in milliseconds.
 */
export const TI = packet("TI", {
  timer_id: num(),
  command: num(),
  time: num(),
});

/**
 * BN (s2c) — background change. `position` overrides the side-default
 * background frame (empty = use the side's default). Legacy emitters
 * omit the `position` slot when unset; aolib canonicalises to empty.
 */
export const BN = packet("BN", {
  background: str(),
  position: opt(str(), ""),
});

/**
 * SP (s2c) — side / position change. `side` is one of the AO position
 * string codes; exposed as the `Side` enum from MS for consistency.
 */
const KNOWN_SIDES = new Set<string>(Object.values(Side));
const parseSide = (s: string): Side => {
  const lower = s.toLowerCase();
  return KNOWN_SIDES.has(lower) ? (lower as Side) : Side.WITNESS;
};

const sideField = (): CustomField<Side> =>
  custom<Side>({
    fromFanta: (token) => parseSide(token),
    toFanta: (value) => value,
  });

export const SP = packet("SP", { side: sideField() });

// ---------------------------------------------------------------------
// s2c — lists / batches
// ---------------------------------------------------------------------

/**
 * SC (s2c) — full character list. Each entry packs into one positional
 * slot as `name&desc&evidence`; JSON envelopes carry the typed array
 * directly.
 */
export const SC = packet("SC", {
  char_data: array(nested({
    name: str(),
    desc: opt(str(), ""),
    evidence: opt(str(), ""),
  })),
});

/**
 * SM (s2c) — server pushes the music list (and area list) to the
 * client. Same wire shape as FM but different semantics: SM appears
 * once in the join sequence and includes areas before the first audio
 * filename; FM is a periodic refresh and never contains areas.
 */
export const SM = packet("SM", {
  music_list: array(nested({ name: str() })),
});

/**
 * FM (s2c) — full music list, replacing the client's current list.
 * Same wire shape as SM; FM never contains areas.
 */
export const FM = packet("FM", {
  music_list: array(nested({ name: str() })),
});

/** FA (s2c) — full area list as a flat array of area names. */
export const FA = packet("FA", { areas: array(str()) });

/**
 * FL (s2c) — server feature flags. Standard flags include
 * `"yellowtext"`, `"cccc_ic_support"`, `"flipping"`, `"looping_sfx"`,
 * `"effects"`, `"y_offset"`. Clients negotiate behavior against this list.
 */
export const FL = packet("FL", { features: array(str()) });

/**
 * CharsCheck (s2c) — character-slot occupancy bitmask. Each element
 * is `0` (vacant) or `1` (taken); the index is the char id.
 */
export const CharsCheck = packet("CharsCheck", { taken: array(num()) });

/**
 * CI (s2c) — incremental character info. Each entry's `data` is an
 * `&`-delimited blob the receiver re-splits per character; aolib keeps
 * it as one opaque string to avoid corrupting the inner separators.
 * Wire shape per entry: `index&data`.
 */
export const CI = packet("CI", {
  batchIndex: num(),
  entries: array(nested({ index: num(), data: str() })),
});

/**
 * EM (s2c) — incremental music/area batch. Each entry is an
 * (index, track-or-area-name) pair packed as `index&name`.
 */
export const EM = packet("EM", {
  batchIndex: num(),
  entries: array(nested({ index: num(), name: str() })),
});

/**
 * EI (s2c) — per-evidence info packet. `details` packs into one slot
 * as `name&description&type&image` — kept nested so the typed shape
 * stays flat-per-evidence with model-owned inner separators.
 */
export const EI = packet("EI", {
  id: num(),
  details: nested({
    name: str(),
    description: str(),
    type: str(),
    image: str(),
  }),
});

/**
 * LE (s2c) — full evidence list. Each entry packs into one positional
 * slot as `name&description&image`.
 */
export const LE = packet("LE", {
  evidence: array(nested({
    name: str(),
    description: str(),
    image: str(),
  })),
});

/**
 * RMC (s2c) — music offset / seek command. `toTime` is a seconds
 * string passed directly to the audio element's `currentTime`.
 */
export const RMC = packet("RMC", { toTime: str() });

// ---------------------------------------------------------------------
// s2c — player roster
// ---------------------------------------------------------------------

/**
 * PN (s2c) — server info (player count and description).
 * `server_description` is legacy-optional; aolib canonicalises absent
 * to empty string.
 */
export const PN = packet("PN", {
  player_count: num(),
  max_players: num(),
  server_description: opt(str(), ""),
});

/** PR (s2c) — player roster change. `type` is 0 = join, 1 = leave. */
export const PR = packet("PR", {
  id: num(),
  type: num(),
});

/**
 * PU (s2c) — player list field update. `type`: 0 = name, 1 = char
 * name, 2 = showname, 3 = area. `data` carries the new value for that
 * field for player `id`.
 */
export const PU = packet("PU", {
  id: num(),
  type: num(),
  data: str(),
});

/**
 * ASS (s2c) — asset origin update. The sentinel `"None"` means "keep
 * the current asset host"; any other value replaces it.
 */
export const ASS = packet("ASS", { asset_url: str() });

/**
 * AUTH (s2c) — mod-privilege level for this client. `1` means
 * authenticated as moderator; `0` revokes privileges.
 */
export const AUTH = packet("AUTH", { auth_state: num() });

// ---------------------------------------------------------------------
// s2c — moderation
// ---------------------------------------------------------------------

/** BD (s2c) — banned-on-reconnect screen with a reason message. */
export const BD = packet("BD", { reason: str() });

/** KB (s2c) — kicked and banned. `reason` is shown on the ban screen. */
export const KB = packet("KB", { reason: str() });

/** KK (s2c) — kicked (transient); reason shown but reconnect is allowed. */
export const KK = packet("KK", { reason: str() });

// ---------------------------------------------------------------------
// s2c — voice
// ---------------------------------------------------------------------

/**
 * VS_AUDIO (s2c) — voice audio frame from a remote peer. `fromUid`
 * identifies the speaker. `payload` is base64-encoded Opus, opaque.
 */
export const VS_AUDIO = packet("VS_AUDIO", {
  fromUid: num(),
  payload: str(),
});

/**
 * VS_CAPS (s2c) — voice subsystem capability advertisement. Arrives
 * twice in the modern handshake (after FL and after DONE); the
 * payload is idempotent so the second arrival is harmless.
 */
export const VS_CAPS = packet("VS_CAPS", {
  enabled: bool(),
  pttOnly: bool(),
  maxPeers: num(),
  codec: str(),
  sampleRate: num(),
  frameMs: num(),
  maxFrameBytes: num(),
});

/**
 * VS_PEERS (s2c) — initial voice-peer list for the joining client.
 * `uids` is the set of remote voice-active peers; the client opens
 * an RTC connection to each.
 */
export const VS_PEERS = packet("VS_PEERS", { uids: array(num()) });

// ---------------------------------------------------------------------
// Bidirectional voice signalling — asymmetric Request/Broadcast pairs.
// ---------------------------------------------------------------------

/**
 * VS_JOIN — voice peer join. Asymmetric:
 *   c2s: empty payload (server attaches the source uid).
 *   s2c: `{ uid }` — the joining peer's uid.
 */
export const VS_JOINRequest = packet("VS_JOIN", {});
export const VS_JOINBroadcast = packet("VS_JOIN", { uid: num() });

/**
 * VS_LEAVE — voice peer leave. Asymmetric:
 *   c2s: empty payload (server attaches the source uid).
 *   s2c: `{ uid }` — the leaving peer's uid.
 */
export const VS_LEAVERequest = packet("VS_LEAVE", {});
export const VS_LEAVEBroadcast = packet("VS_LEAVE", { uid: num() });

/**
 * VS_SPEAK — voice speak-state toggle. Asymmetric:
 *   c2s: `{ on }`. Server attaches the source uid before rebroadcasting.
 *   s2c: `{ uid, on }`.
 */
export const VS_SPEAKRequest = packet("VS_SPEAK", { on: bool() });
export const VS_SPEAKBroadcast = packet("VS_SPEAK", {
  uid: num(),
  on: bool(),
});
