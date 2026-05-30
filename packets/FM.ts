/**
 * FM (s2c) — full music list, replacing the client's current list.
 *
 * Same wire shape as SM but different semantics: SM appears once in
 * the join sequence (and includes areas before the first audio
 * filename); FM is a periodic refresh and never contains areas.
 */
import { packet } from "../schema";
import { str, nested, array } from "../fields";

export const FM = packet("FM", {
  music_list: array(nested({ name: str() })),
});
