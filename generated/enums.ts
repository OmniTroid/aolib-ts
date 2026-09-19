// AUTO-GENERATED from aolib-meta/schemas/enums/*. Do not edit; run `bun run codegen`.

/** Discriminator for ARUP payloads: 0 = player counts (numbers), 1/2/3 = area metadata strings. */
export enum AreaUpdateType {
  player_count = 0,
  status = 1,
  case_manager = 2,
  locked = 3,
}

/** Desk visibility behavior. */
export enum DeskModifier {
  hidden = 0,
  shown = 1,
  hide_during_preanim = 2,
  show_during_preanim = 3,
  hide_and_center_during_preanim = 4,
  show_during_preanim_then_center = 5,
}

/** Emote behavior selector. Spec values 3 and 4 are documented as unused. */
export enum EmoteModifier {
  no_preanim = 0,
  preanim = 1,
  preanim_and_objection = 2,
  unused_3 = 3,
  unused_4 = 4,
  zoom = 5,
  objection_zoom = 6,
}

/** Sprite mirroring. */
export enum Flip {
  none = 0,
  horizontal = 1,
  vertical = 2,
  horizontal_and_vertical = 3,
}

/** Shout / objection selector. */
export enum ShoutModifier {
  none = 0,
  hold_it = 1,
  objection = 2,
  take_that = 3,
  custom = 4,
}

/** Character position. Wire values are the lowercase 3-letter codes. */
export enum Side {
  defense = "def",
  prosecution = "pro",
  defense_helper = "hld",
  prosecution_helper = "hlp",
  witness = "wit",
  judge = "jud",
  jury = "jur",
  seance = "sea",
}

/** Chat message text color. `blue` also disables the talking animation. */
export enum TextColor {
  white = 0,
  green = 1,
  red = 2,
  orange = 3,
  blue = 4,
  yellow = 5,
  pink = 6,
  cyan = 7,
  grey = 8,
  rainbow = 9,
}
