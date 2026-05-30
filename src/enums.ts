/**
 * Named-enum conveniences for MS and ARUP.
 *
 * The JSON Schemas for these packets define the underlying values
 * (e.g. `"side": { "enum": ["def", "pro", ...] }`). These exports
 * give callers human-friendly names so they can write
 * `Side.WITNESS` instead of `"wit"`. Each enum's values match the
 * schema; if you change one, change the other.
 */

// ---------------------------------------------------------------------
// MS
// ---------------------------------------------------------------------

export enum DeskModifier {
  HIDDEN = 0,
  SHOWN = 1,
  HIDE_DURING_PREANIM = 2,
  SHOW_DURING_PREANIM = 3,
  HIDE_AND_CENTER_DURING_PREANIM = 4,
  SHOW_DURING_PREANIM_THEN_CENTER = 5,
}

export enum EmoteModifier {
  NO_PREANIM = 0,
  PREANIM = 1,
  PREANIM_AND_OBJECTION = 2,
  ZOOM = 5,
  OBJECTION_ZOOM = 6,
}

export enum ShoutModifier {
  NONE = 0,
  HOLD_IT = 1,
  OBJECTION = 2,
  TAKE_THAT = 3,
  CUSTOM = 4,
}

export enum Flip {
  NONE = 0,
  HORIZONTAL = 1,
  VERTICAL = 2,
  HORIZONTAL_AND_VERTICAL = 3,
}

export enum TextColor {
  WHITE = 0,
  GREEN = 1,
  RED = 2,
  ORANGE = 3,
  BLUE = 4,
  YELLOW = 5,
  PINK = 6,
  CYAN = 7,
  GREY = 8,
  RAINBOW = 9,
}

export enum Side {
  DEFENSE = "def",
  PROSECUTION = "pro",
  DEFENSE_HELPER = "hld",
  PROSECUTION_HELPER = "hlp",
  WITNESS = "wit",
  JUDGE = "jud",
  JURY = "jur",
  SEANCE = "sea",
}

export interface Offset {
  x: number;
  y: number;
}

export const isFullView = (s: Side): boolean =>
  s === Side.DEFENSE || s === Side.PROSECUTION || s === Side.WITNESS;

// ---------------------------------------------------------------------
// ARUP
// ---------------------------------------------------------------------

export enum AreaUpdateType {
  PLAYER_COUNT = 0,
  STATUS = 1,
  CASE_MANAGER = 2,
  LOCKED = 3,
}

export type AreaUpdateData = number[] | string[];
