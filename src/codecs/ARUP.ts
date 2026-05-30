/**
 * ARUP fanta codec.
 *
 * ARUP's `update_data` element type depends on the sibling
 * `update_type` field's value (0 = number[], 1/2/3 = string[]). The
 * generic JSON-Schema walker has no way to express that, so ARUP
 * registers a bespoke codec and the walker hands it the raw args.
 *
 * Wire shape: `ARUP#<update_type>#<value_for_area_0>#<value_for_area_1>#…#%`.
 */

import { registerCodec, escapeFanta, unescapeFanta } from "../fanta";

registerCodec("ARUP", {
  encode(packet) {
    const updateType = Number(packet.update_type);
    const data = (packet.update_data as unknown[] | undefined) ?? [];
    const slots = updateType === 0
      ? data.map((v) => String(v))
      : data.map((v) => escapeFanta(String(v)));
    return [String(updateType), ...slots];
  },

  decode(args) {
    const updateType = Number(args[0] ?? "0");
    const rest = args.slice(1);
    const update_data: unknown[] =
      updateType === 0
        ? rest.map((v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        })
        : rest.map(unescapeFanta);
    return { update_type: updateType, update_data };
  },
});
