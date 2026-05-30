import { describe, it, expect } from "bun:test";
import { encode } from "../src/encode";
import { decode } from "../src/decode";
import { server, client } from "../src/session";
import {
  MSRequest as MSRequestClass,
  MSBroadcast as MSBroadcastClass,
  MSRequestSchema as MSRequest,
  MSBroadcastSchema as MSBroadcast,
} from "../generated/packets";
import {
  Side,
  DeskModifier,
  EmoteModifier,
  ShoutModifier,
  Flip,
  TextColor,
  isFullView,
  type Offset,
} from "../src/enums";

type MSRequestType = MSRequestClass;
type MSBroadcastType = MSBroadcastClass;

// ---------------------------------------------------------------------
// Enums round-trip on every wire format.
// ---------------------------------------------------------------------

describe("MS: enum values round-trip", () => {
  const minimal = {
    character: "Phoenix",
    emote: "normal",
    message: "Objection!",
    side: Side.DEFENSE,
    char_id: 1,
  };

  it("DeskModifier maps to its underlying integer on the wire", () => {
    const fanta = encode(
      MSRequest,
      { ...minimal, desk_modifier: DeskModifier.HIDE_DURING_PREANIM },
      "fanta",
    );
    // Slot 0 (after `MS#`) holds the desk_modifier value, `2`.
    expect(fanta.startsWith("MS#2#")).toBe(true);
    const decoded = decode(MSRequest, fanta) as unknown as MSRequestType;
    expect(decoded.desk_modifier).toBe(DeskModifier.HIDE_DURING_PREANIM);
  });

  it("EmoteModifier round-trips for every enum value", () => {
    for (const v of [
      EmoteModifier.NO_PREANIM,
      EmoteModifier.PREANIM,
      EmoteModifier.PREANIM_AND_OBJECTION,
      EmoteModifier.ZOOM,
      EmoteModifier.OBJECTION_ZOOM,
    ]) {
      const w = encode(MSRequest, { ...minimal, emote_modifier: v }, "fanta");
      expect((decode(MSRequest, w) as unknown as MSRequestType).emote_modifier).toBe(v);
    }
  });

  it("ShoutModifier round-trips for every enum value", () => {
    for (const v of [
      ShoutModifier.NONE,
      ShoutModifier.HOLD_IT,
      ShoutModifier.OBJECTION,
      ShoutModifier.TAKE_THAT,
      ShoutModifier.CUSTOM,
    ]) {
      const w = encode(MSRequest, { ...minimal, shout_modifier: v }, "fanta");
      expect((decode(MSRequest, w) as unknown as MSRequestType).shout_modifier).toBe(v);
    }
  });

  it("Flip round-trips", () => {
    for (const v of [Flip.NONE, Flip.HORIZONTAL, Flip.VERTICAL, Flip.HORIZONTAL_AND_VERTICAL]) {
      const w = encode(MSRequest, { ...minimal, flip: v }, "fanta");
      expect((decode(MSRequest, w) as unknown as MSRequestType).flip).toBe(v);
    }
  });

  it("TextColor round-trips for every enum value", () => {
    for (const v of [
      TextColor.WHITE, TextColor.GREEN, TextColor.RED, TextColor.ORANGE,
      TextColor.BLUE, TextColor.YELLOW, TextColor.PINK, TextColor.CYAN,
      TextColor.GREY, TextColor.RAINBOW,
    ]) {
      const w = encode(MSRequest, { ...minimal, text_color: v }, "fanta");
      expect((decode(MSRequest, w) as unknown as MSRequestType).text_color).toBe(v);
    }
  });

  it("Side carries the 3-letter wire value", () => {
    for (const v of [
      Side.DEFENSE, Side.PROSECUTION, Side.DEFENSE_HELPER,
      Side.PROSECUTION_HELPER, Side.WITNESS, Side.JUDGE, Side.JURY,
      Side.SEANCE,
    ]) {
      const w = encode(MSRequest, { ...minimal, side: v }, "fanta");
      // Slot 5 (after `MS#`) holds side.
      expect(w.split("#")[6]).toBe(v);
      expect((decode(MSRequest, w) as unknown as MSRequestType).side).toBe(v);
    }
  });
});

// ---------------------------------------------------------------------
// Optional defaults — caller can omit nearly everything.
// ---------------------------------------------------------------------

describe("MS: minimal-input encoding fills every default", () => {
  it("MSRequest with only required fields produces a valid 27-token wire", () => {
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "Hello",
        side: Side.WITNESS,
        char_id: 5,
      },
      "fanta",
    );
    // Header + 26 fields = 27 tokens, then `%` terminator.
    const parts = wire.split("#");
    expect(parts[0]).toBe("MS");
    expect(parts.length).toBe(28); // 27 + the trailing "%"
    expect(parts[parts.length - 1]).toBe("%");
  });

  it("decode of that minimal wire fills all defaults", () => {
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "Hello",
        side: Side.WITNESS,
        char_id: 5,
      },
      "fanta",
    );
    const decoded = decode(MSRequest, wire) as unknown as MSRequestType;
    expect(decoded).toMatchObject({
      desk_modifier: DeskModifier.SHOWN,
      preanim: "",
      character: "Phoenix",
      emote: "normal",
      message: "Hello",
      side: Side.WITNESS,
      sfx_name: "",
      emote_modifier: EmoteModifier.NO_PREANIM,
      char_id: 5,
      sfx_delay: 0,
      shout_modifier: ShoutModifier.NONE,
      evidence_id: 0,
      flip: Flip.NONE,
      realization: false,
      text_color: TextColor.WHITE,
      showname: "",
      paired_charid: -1,
      offset: { x: 0, y: 0 },
      noninterrupting_preanim: false,
      sfx_looping: false,
      screenshake: false,
      frames_shake: "",
      frames_realization: "",
      frames_sfx: "",
      additive: false,
      effect: "",
    });
  });
});

// ---------------------------------------------------------------------
// Offset: `x&y` with `<and>` escape on fanta, `{x, y}` native on JSON.
// ---------------------------------------------------------------------

describe("MS: offset codec", () => {
  it("offset packs as `x<and>y` on the fanta wire", () => {
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "hi",
        side: Side.WITNESS,
        char_id: 0,
        offset: { x: 50, y: -20 },
      },
      "fanta",
    );
    // Slot 18 holds offset (HEAD has 17 fields, offset is field 18,
    // which is at index 18 in the `#`-split array after the header).
    const parts = wire.split("#");
    expect(parts[18]).toBe("50<and>-20");
  });

  it("offset decodes from the escaped wire form", () => {
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "hi",
        side: Side.WITNESS,
        char_id: 0,
        offset: { x: 50, y: -20 },
      },
      "fanta",
    );
    const decoded = decode(MSRequest, wire) as unknown as MSRequestType;
    expect(decoded.offset).toEqual({ x: 50, y: -20 });
  });

  it("offset is a native object on JSON (no escape dance)", () => {
    const json = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "hi",
        side: Side.WITNESS,
        char_id: 0,
        offset: { x: 50, y: -20 },
      },
      "json",
    );
    expect(JSON.parse(json).offset).toEqual({ x: 50, y: -20 });
    const decoded = decode(MSRequest, json) as unknown as MSRequestType;
    expect(decoded.offset).toEqual({ x: 50, y: -20 });
  });

});

// ---------------------------------------------------------------------
// Asymmetric shapes: MSRequest (26 fields) vs MSBroadcast (30 fields).
// ---------------------------------------------------------------------

describe("MS: request vs broadcast shape divergence", () => {
  it("MSRequest wire has exactly 26 positional slots after the header", () => {
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "hi",
        side: Side.WITNESS,
        char_id: 1,
      },
      "fanta",
    );
    // header + 26 fields + terminator = 28 elements when split by `#`.
    expect(wire.split("#").length).toBe(28);
  });

  it("MSBroadcast wire has exactly 30 positional slots after the header", () => {
    const wire = encode(
      MSBroadcast,
      {
        character: "Phoenix",
        emote: "normal",
        message: "hi",
        side: Side.WITNESS,
        char_id: 1,
      },
      "fanta",
    );
    expect(wire.split("#").length).toBe(32);
  });

  it("MSBroadcast carries paired_name / paired_emote / paired_offset / paired_flip", () => {
    const wire = encode(
      MSBroadcast,
      {
        character: "Phoenix",
        emote: "normal",
        message: "I am paired",
        side: Side.WITNESS,
        char_id: 1,
        paired_name: "Edgeworth",
        paired_emote: "smirk",
        paired_offset: { x: 100, y: 0 },
        paired_flip: Flip.HORIZONTAL,
      },
      "fanta",
    );
    const decoded = decode(MSBroadcast, wire) as unknown as MSBroadcastType;
    expect(decoded.paired_name).toBe("Edgeworth");
    expect(decoded.paired_emote).toBe("smirk");
    expect(decoded.paired_offset).toEqual({ x: 100, y: 0 });
    expect(decoded.paired_flip).toBe(Flip.HORIZONTAL);
  });

  it("missing required field on the wire throws (cast guards the boundary)", () => {
    // Sending MS without `char_id` should be rejected — the typed API
    // requires character, message, side, char_id at minimum.
    expect(() =>
      decode(MSBroadcast, "MS#1#preanim#Phoenix##Hello#wit#%"),
    ).toThrow(/must have required property 'char_id'/);
  });
});

// ---------------------------------------------------------------------
// Chat-escape passes through every string field.
// ---------------------------------------------------------------------

describe("MS: chat-meta in user fields round-trips", () => {
  it("message field with #, &, %, $ survives", () => {
    const p = {
      character: "Phoenix",
      emote: "normal",
      message: "100% sure & #1 takes $5",
      side: Side.WITNESS,
      char_id: 1,
    };
    const wire = encode(MSRequest, p, "fanta");
    const decoded = decode(MSRequest, wire) as unknown as MSRequestType;
    expect(decoded.message).toBe("100% sure & #1 takes $5");
  });

  it("showname with meta-chars", () => {
    const p = {
      character: "Phoenix",
      emote: "normal",
      message: "hi",
      side: Side.WITNESS,
      char_id: 1,
      showname: "Wright & Co.",
    };
    const decoded = decode(
      MSRequest,
      encode(MSRequest, p, "fanta"),
    ) as unknown as MSRequestType;
    expect(decoded.showname).toBe("Wright & Co.");
  });
});

// ---------------------------------------------------------------------
// JSON round-trips
// ---------------------------------------------------------------------

describe("MS: JSON envelope round-trip", () => {
  it("MSBroadcast: all fields preserved", () => {
    const p: ConstructorParameters<typeof MSBroadcastClass>[0] = {
      desk_modifier: DeskModifier.SHOWN,
      preanim: "phoenix-confident",
      character: "Phoenix",
      emote: "normal",
      message: "Objection!",
      side: Side.DEFENSE,
      sfx_name: "objection.opus",
      emote_modifier: EmoteModifier.PREANIM_AND_OBJECTION,
      char_id: 5,
      sfx_delay: 0,
      shout_modifier: ShoutModifier.OBJECTION,
      evidence_id: 3,
      flip: Flip.NONE,
      realization: false,
      text_color: TextColor.RED,
      showname: "Phoenix Wright",
      paired_charid: -1,
      paired_name: "",
      paired_emote: "",
      offset: { x: 0, y: 0 },
      paired_offset: { x: 0, y: 0 },
      paired_flip: Flip.NONE,
      noninterrupting_preanim: false,
      sfx_looping: false,
      screenshake: false,
      frames_shake: "",
      frames_realization: "",
      frames_sfx: "",
      additive: false,
      effect: "",
    };
    const json = encode(MSBroadcast, p, "json");
    const decoded = decode(MSBroadcast, json) as unknown as MSBroadcastType;
    expect(decoded).toEqual(p as unknown as MSBroadcastType);
  });

  it("enums survive a JSON round-trip with the correct typed value", () => {
    const p: ConstructorParameters<typeof MSRequestClass>[0] = {
      character: "Phoenix",
      emote: "normal",
      message: "Objection!",
      side: Side.PROSECUTION,
      char_id: 7,
      shout_modifier: ShoutModifier.HOLD_IT,
      text_color: TextColor.BLUE,
    };
    const json = encode(MSRequest, p, "json");
    const decoded = decode(MSRequest, json) as unknown as MSRequestType;
    expect(decoded.side).toBe(Side.PROSECUTION);
    expect(decoded.shout_modifier).toBe(ShoutModifier.HOLD_IT);
    expect(decoded.text_color).toBe(TextColor.BLUE);
  });
});

// ---------------------------------------------------------------------
// Session integration.
// ---------------------------------------------------------------------

describe("MS: session integration", () => {
  it("server.send.MS uses MSRequest (no paired_name)", () => {
    const out: string[] = [];
    const s = server({ send: (w) => out.push(w) });
    s.send.MS({
      character: "Phoenix",
      emote: "normal",
      message: "hi",
      side: Side.WITNESS,
      char_id: 1,
    });
    expect(out.length).toBe(1);
    // 26-field wire shape.
    expect(out[0]!.split("#").length).toBe(28);
  });

  it("server.on.MS receives MSBroadcast shape (has paired_name)", () => {
    const s = server({ send: () => {} });
    let received: MSBroadcastType | undefined;
    s.on.MS((p) => {
      received = p;
    });
    // A 30-field broadcast.
    const wire = encode(
      MSBroadcast,
      {
        character: "Edgeworth",
        emote: "normal",
        message: "I object",
        side: Side.PROSECUTION,
        char_id: 2,
        paired_name: "Phoenix",
        paired_emote: "stunned",
      },
      "fanta",
    );
    s.receive(wire);
    expect(received).toBeDefined();
    expect(received!.character).toBe("Edgeworth");
    expect(received!.paired_name).toBe("Phoenix");
    expect(received!.paired_emote).toBe("stunned");
  });

  it("client.send.MS uses MSBroadcast (has paired_*)", () => {
    const out: string[] = [];
    const c = client({ send: (w) => out.push(w) });
    c.send.MS({
      character: "Phoenix",
      emote: "normal",
      message: "broadcast",
      side: Side.WITNESS,
      char_id: 1,
      paired_name: "Edgeworth",
      paired_offset: { x: 50, y: 0 },
    });
    expect(out.length).toBe(1);
    expect(out[0]!.split("#").length).toBe(32);
  });

  it("client.on.MS receives MSRequest shape (no paired_name field present)", () => {
    const c = client({ send: () => {} });
    let received: MSRequestType | undefined;
    c.on.MS((p) => {
      received = p;
    });
    const wire = encode(
      MSRequest,
      {
        character: "Phoenix",
        emote: "normal",
        message: "from client",
        side: Side.DEFENSE,
        char_id: 5,
      },
      "fanta",
    );
    c.receive(wire);
    expect(received).toBeDefined();
    expect(received!.character).toBe("Phoenix");
    expect("paired_name" in (received as object)).toBe(false);
  });
});

// ---------------------------------------------------------------------
// isFullView helper.
// ---------------------------------------------------------------------

describe("MS: isFullView()", () => {
  it("is true for DEFENSE, PROSECUTION, WITNESS", () => {
    expect(isFullView(Side.DEFENSE)).toBe(true);
    expect(isFullView(Side.PROSECUTION)).toBe(true);
    expect(isFullView(Side.WITNESS)).toBe(true);
  });

  it("is false for everything else", () => {
    expect(isFullView(Side.JUDGE)).toBe(false);
    expect(isFullView(Side.JURY)).toBe(false);
    expect(isFullView(Side.SEANCE)).toBe(false);
    expect(isFullView(Side.DEFENSE_HELPER)).toBe(false);
    expect(isFullView(Side.PROSECUTION_HELPER)).toBe(false);
  });
});

// ---------------------------------------------------------------------
// Type-level sanity (compiles only — no runtime effect).
// ---------------------------------------------------------------------

describe("MS: type derivation", () => {
  it("In<MSRequest>.side is Side; Out<MSRequest>.side is Side", () => {
    // The point of this test is the TypeScript types; if it
    // compiles, we're good. Runtime is trivial.
    const sideIn: MSRequestType["side"] = Side.WITNESS;
    const offIn: MSRequestType["offset"] | undefined = undefined;
    const off: Offset = { x: 1, y: 2 };
    expect(sideIn).toBe(Side.WITNESS);
    expect(offIn).toBeUndefined();
    expect(off).toEqual({ x: 1, y: 2 });
  });
});
