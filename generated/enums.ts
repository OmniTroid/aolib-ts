// AUTO-GENERATED from aolib-meta/schemas/enums/*. Do not edit; run `bun run codegen`.

/** Discriminator for ARUP payloads: 0 = player counts (numbers), 1/2/3 = area metadata strings. */
export enum AreaUpdateType {
  PLAYER_COUNT = 0,
  STATUS = 1,
  CASE_MANAGER = 2,
  LOCKED = 3,
}

/** Desk visibility behavior. */
export enum DeskModifier {
  HIDDEN = 0,
  SHOWN = 1,
  HIDE_DURING_PREANIM = 2,
  SHOW_DURING_PREANIM = 3,
  HIDE_AND_CENTER_DURING_PREANIM = 4,
  SHOW_DURING_PREANIM_THEN_CENTER = 5,
}

/** Emote behavior selector. Spec values 3 and 4 are documented as unused. */
export enum EmoteModifier {
  NO_PREANIM = 0,
  PREANIM = 1,
  PREANIM_AND_OBJECTION = 2,
  ZOOM = 5,
  OBJECTION_ZOOM = 6,
}

/** Sprite mirroring. Spec defines only NONE / HORIZONTAL; VERTICAL and HORIZONTAL_AND_VERTICAL are non-spec extensions servers may send. */
export enum Flip {
  NONE = 0,
  HORIZONTAL = 1,
  VERTICAL = 2,
  HORIZONTAL_AND_VERTICAL = 3,
}

/** Shout / objection selector. The legacy `4&{name}` wire form for naming a custom shout strips to CUSTOM at the codec layer. */
export enum ShoutModifier {
  NONE = 0,
  HOLD_IT = 1,
  OBJECTION = 2,
  TAKE_THAT = 3,
  CUSTOM = 4,
}

/** Character position. Wire values are the lowercase 3-letter codes. */
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

/** Chat message text color. `BLUE` also disables the talking animation. */
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
