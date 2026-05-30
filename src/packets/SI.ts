/**
 * SI (s2c) — server info (counts only).
 *
 * Triggers the client to start the character / evidence / music
 * download sequence (RC / RD / RM).
 */
import { packet } from "../schema";
import { num } from "../fields";

export const SI = packet("SI", {
  char_count: num(),
  evi_count: num(),
  mus_count: num(),
});
