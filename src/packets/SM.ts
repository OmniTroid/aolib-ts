/**
 * SM (s2c) — server pushes the music list (and area list) to the client.
 *
 * Per spec, `music_list` is an array of `{name}` objects:
 *
 *   Fanta:  SM#{music1_name}#{music2_name}#...#%
 *   JSON:   {"$header":"SM","music_list":[{"name":"..."}, ...]}
 *
 * Each entry is either a track filename (the name ends in a file
 * extension) or an area name (no extension). The receiver splits the
 * list on that rule.
 */

import { packet } from "../schema";
import { str, nested, array } from "../fields";

export const SM = packet("SM", {
  music_list: array(nested({ name: str() })),
});
