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
 * then a tuning pass folds the flat sections into a typed `CharIni`:
 * case-insensitive section/key lookup (authors mix `[Options]` and
 * `[options]`), and the parallel `[Emotions]` / `[SoundN]` / `[SoundT]`
 * banks zipped into one `CharEmote[]` indexed by emote id.
 *
 * Values are preserved verbatim (only section and key *names* are
 * lowercased for lookup). Callers that need case-folded values for
 * case-insensitive asset URLs should lowercase at the point of use.
 */

import { parse as parseIni } from "js-ini";

/** One entry from the `[Emotions]` bank, zipped with its sound rows. */
export interface CharEmote {
  /** 1-based emote id (the key in `[Emotions]`). */
  id: number;
  /** Display name shown on the emote button. */
  name: string;
  /** Pre-animation to play before the idle/talk loop; `-` means none. */
  preanim: string;
  /** Base animation name (idle/talk share this stem). */
  anim: string;
  /** Playback modifier (0 = idle only, 1 = play preanim, etc.). */
  modifier: number;
  /** Desk modifier, when the emote specifies a 5th field; else null. */
  deskMod: number | null;
  /** `[SoundN]` value for this id (sound effect name); null if absent. */
  sound: string | null;
  /** `[SoundT]` value for this id (delay in ticks); null if absent. */
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
    ...opt,
  };

  const emotionSection = sections.emotions ?? {};
  const soundN = sections.soundn ?? {};
  const soundT = sections.soundt ?? {};

  const count = toInt(emotionSection.number, 0);
  const emotes: CharEmote[] = [];
  for (let id = 1; id <= count; id++) {
    const def = emotionSection[String(id)];
    if (def === undefined) continue;

    const parts = def.split("#");
    const sound = soundN[String(id)];
    const delay = soundT[String(id)];

    emotes.push({
      id,
      name: parts[0] ?? "",
      preanim: parts[1] ?? "",
      anim: parts[2] ?? "",
      modifier: toInt(parts[3], 0),
      deskMod: parts.length > 4 ? toInt(parts[4], 0) : null,
      sound: sound !== undefined && sound !== "" ? sound : null,
      soundDelay: delay !== undefined ? toInt(delay, 0) : null,
    });
  }

  return { options, emotes, sections };
}
