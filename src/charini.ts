/**
 * char.ini parser.
 *
 * char.ini is the per-character asset manifest every AO client reads:
 * `[options]` metadata plus a bank of emotes with their animations and
 * sounds. It is INI-shaped but with one AO-specific quirk that rules
 * out most INI libraries: emote values are `#`-delimited records
 * (`normal#-#idle#1`), and the common `ini` package treats an unescaped
 * `#` as an inline comment, truncating every emote to its first field.
 *
 * So the base parse uses `js-ini` with `#` left out of the comment set,
 * then a tuning pass folds the flat sections into a typed `CharIni`.
 *
 * Two emote encodings are normalized to one `CharEmote[]` (per the spec
 * in aolib-meta `schemas/assets`):
 *
 *   - `[emote <name>]` blocks (preferred): `[emotions]` lists the button
 *     order as `N = <blockname>`, and each `[emote <blockname>]` section
 *     carries `anim` / `preanim` / `sound` / `modifier` / `desk` fields.
 *     `modifier` takes a number or an EmoteModifier name (e.g. `zoom`).
 *   - Legacy banks (fallback, used when no `[emote ...]` block exists):
 *     `[emotions] N = desc#preanim#anim#modifier#deskMod`, zipped with
 *     `[soundn]` and `[soundt]` by id.
 *
 * The normalized `key` is the block name (blocks) or the stringified id
 * (legacy); it is the identity `camera.json` and the animation files key
 * off. Section and key *names* are lowercased for lookup; values are
 * preserved verbatim, so lowercase at the point of use if you build
 * case-insensitive asset URLs.
 */

import { parse as parseIni } from "js-ini";
import { DeskModifier, EmoteModifier } from "../generated/enums";

// One AO tick in milliseconds: the message text update interval that
// drives sound/preanim timing (LemmyAO's `UPDATE_INTERVAL`). Legacy
// `[soundt]` is expressed in ticks; `soundDelay` is normalized to ms.
const TICK_MS = 60;

/** Case-insensitive enum-name -> value map, so a field can write
 * `modifier = zoom` (or `deskmod = shown`) instead of a bare number. */
function nameMap(e: Record<string, string | number>): Record<string, number> {
  const m: Record<string, number> = {};
  for (const [name, value] of Object.entries(e)) {
    if (typeof value === "number") m[name.toLowerCase()] = value;
  }
  return m;
}
const MODIFIER_NAMES = nameMap(EmoteModifier);
const DESKMOD_NAMES = nameMap(DeskModifier);

/** One normalized emote, from a block or a legacy bank row. */
export interface CharEmote {
  /** 1-based position in the emote button list. */
  id: number;
  /** Stable identity: block name, or the stringified id for legacy. */
  key: string;
  /** Display label shown on the emote button. */
  name: string;
  /** Animation base name (2D sprite stem or 3D base VMD stem). */
  anim: string;
  /** Pre-animation base name, or null when none (`-` in the file). */
  preanim: string | null;
  /** AO emote modifier (0 = none, 1 = play preanim, 5/6 = zoom). */
  modifier: number;
  /** Desk modifier when specified, else null. */
  deskMod: number | null;
  /** Sound-effect name for this emote, or null. */
  sound: string | null;
  /** Sound delay in milliseconds, or null. */
  soundDelay: number | null;
}

/** `[options]` block. Common keys are typed; the rest stay on the index. */
export interface CharIniOptions {
  name: string;
  showname: string;
  side: string;
  gender: string;
  blips: string;
  chat: string;
  category: string;
  /** PMX model file for a 3D character; empty for 2D. */
  model: string;
  [key: string]: string;
}

export interface CharIni {
  options: CharIniOptions;
  emotes: CharEmote[];
  /** Every section, lowercased names, values verbatim. Fallback for
   * blocks this parser does not model (shouts, [Time], frame effects). */
  sections: Record<string, Record<string, string>>;
}

function toInt(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

/** `-`, empty, or absent means "no pre-animation"; else the base name. */
function normPreanim(value: string | undefined): string | null {
  return value === undefined || value === "" || value === "-" ? null : value;
}

/** A numeric value or a named enum identifier (case-insensitive). */
function parseEnum(
  value: string | undefined,
  names: Record<string, number>,
): number {
  if (value === undefined || value === "") return 0;
  return names[value.toLowerCase()] ?? toInt(value, 0);
}

/** Empty or absent sound means "no sound"; `0` is kept verbatim. */
function normSound(value: string | undefined): string | null {
  return value === undefined || value === "" ? null : value;
}

/**
 * Parse char.ini text into a typed {@link CharIni}.
 *
 * Missing `[options]` keys default to empty strings so the shape is
 * stable. Emotes are read for ids `1..number`; ids without a definition
 * are skipped rather than emitted as blanks.
 */
export function parseCharIni(data: string): CharIni {
  // `;` is the canonical INI comment; `//` shows up in real char.ini
  // files where authors disable a line. js-ini only strips line-leading
  // comments, so neither can corrupt the `#`-delimited emote values.
  //
  // `nothrow` skips lines that are neither section, comment, nor
  // key=value instead of throwing. Real char.ini files are littered with
  // stray author notes ("made by ...") and `#`-led header lines, and a
  // parser for them must degrade rather than crash.
  const raw = parseIni(data, {
    comment: [";", "//"],
    autoTyping: false,
    nothrow: true,
  });

  // Fold to lowercase section/key names with string values. `js-ini`
  // types values as a union (string | number | boolean | object); with
  // autoTyping off char.ini yields only scalars, so keep those and drop
  // anything structural.
  const sections: Record<string, Record<string, string>> = {};
  for (const [section, body] of Object.entries(raw)) {
    if (typeof body !== "object" || Array.isArray(body)) continue;
    const lower: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "object") continue;
      lower[key.toLowerCase()] = String(value);
    }
    sections[section.toLowerCase()] = lower;
  }

  const opt = sections.options ?? {};
  const options: CharIniOptions = {
    name: "",
    showname: "",
    side: "",
    gender: "",
    blips: "",
    chat: "",
    category: "",
    model: "",
    ...opt,
  };

  const emotionSection = sections.emotions ?? {};
  const count = toInt(emotionSection.number, 0);

  // Prefer `[emote <name>]` blocks; fall back to the legacy banks only
  // when the file carries no such block.
  const useBlocks = Object.keys(sections).some((s) => s.startsWith("emote "));

  const emotes = useBlocks
    ? readBlockEmotes(emotionSection, sections, count)
    : readLegacyEmotes(emotionSection, sections, count);

  return { options, emotes, sections };
}

/** `[emote <name>]` encoding: `[emotions] N = <blockname>` + block sections. */
function readBlockEmotes(
  emotionSection: Record<string, string>,
  sections: Record<string, Record<string, string>>,
  count: number,
): CharEmote[] {
  const emotes: CharEmote[] = [];
  for (let id = 1; id <= count; id++) {
    const key = emotionSection[String(id)];
    if (key === undefined) continue;

    const block = sections[`emote ${key.toLowerCase()}`] ?? {};
    emotes.push({
      id,
      key,
      name: block.name ?? key,
      anim: block.anim ?? "",
      preanim: normPreanim(block.preanim),
      modifier: parseEnum(block.modifier, MODIFIER_NAMES),
      deskMod:
        block.deskmod !== undefined
          ? parseEnum(block.deskmod, DESKMOD_NAMES)
          : null,
      sound: normSound(block.sound),
      soundDelay:
        block.sounddelay !== undefined ? toInt(block.sounddelay, 0) : null,
    });
  }
  return emotes;
}

/** Legacy encoding: `desc#preanim#anim#modifier#deskMod` + [soundn]/[soundt]. */
function readLegacyEmotes(
  emotionSection: Record<string, string>,
  sections: Record<string, Record<string, string>>,
  count: number,
): CharEmote[] {
  const soundN = sections.soundn ?? {};
  const soundT = sections.soundt ?? {};

  const emotes: CharEmote[] = [];
  for (let id = 1; id <= count; id++) {
    const def = emotionSection[String(id)];
    if (def === undefined) continue;

    const parts = def.split("#");
    const delay = soundT[String(id)];
    emotes.push({
      id,
      key: String(id),
      name: parts[0] ?? "",
      anim: parts[2] ?? "",
      preanim: normPreanim(parts[1]),
      modifier: parseEnum(parts[3], MODIFIER_NAMES),
      deskMod: parts.length > 4 ? parseEnum(parts[4], DESKMOD_NAMES) : null,
      sound: normSound(soundN[String(id)]),
      // [soundt] is in ticks; normalize to milliseconds.
      soundDelay: delay !== undefined ? toInt(delay, 0) * TICK_MS : null,
    });
  }
  return emotes;
}
