/**
 * Hand-written supporting types and helpers for the packets whose
 * value space includes things JSON Schema enums don't express well.
 *
 * The actual named enums (Side, DeskModifier, etc.) are codegenned
 * from schemas/*.enum.json into `../generated/enums`. Re-exported
 * here so callers have a single import.
 */

import { Side } from "../generated/enums";

export {
  AreaUpdateType,
  DeskModifier,
  EmoteModifier,
  Flip,
  ShoutModifier,
  Side,
  TextColor,
} from "../generated/enums";

/** `{x, y}` integer offset pair, carried in MS offset / paired_offset slots. */
export interface Offset {
  x: number;
  y: number;
}

/** ARUP payload: numbers for PLAYER_COUNT, strings for everything else. */
export type AreaUpdateData = number[] | string[];

/**
 * Convenience predicate — true for sides whose layout uses the
 * full-view pan-camera. The viewport layer consults this when
 * choosing between single-character and paired-character rendering.
 */
export const isFullView = (s: Side): boolean =>
  s === Side.DEFENSE || s === Side.PROSECUTION || s === Side.WITNESS;
