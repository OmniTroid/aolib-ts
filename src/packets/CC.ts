/**
 * CC (c2s) — client requests a specific character slot.
 *
 * Wire shape is `CC#<player_id>#<char_id>#<char_password>#%`. The
 * leading slot is the player id the server handed us in the ID
 * packet; servers validate that we echo it back. `char_password` is
 * the legacy character-claim password (empty by default; some
 * servers gate locked slots on a non-empty value).
 */

import { packet } from "../schema";
import { num, str, opt } from "../fields";

export const CC = packet("CC", {
  player_id: num(),
  char_id: num(),
  char_password: opt(str(), ""),
});
