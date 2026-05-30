/**
 * SC (s2c) — full character list.
 *
 * Per spec, `char_data` is an array of `{name, desc, evidence}`
 * objects. The fanta wire packs each entry's three fields with `&`
 * separators per positional slot:
 *
 *   SC#{name1}&{desc1}&{evidence1}#{name2}&{desc2}&{evidence2}#...#%
 *
 * JSON envelopes carry the typed array of objects directly. aolib's
 * nested + array primitives handle both forms with one schema.
 */
import { packet } from "../schema";
import { str, opt, nested, array } from "../fields";

export const SC = packet("SC", {
  char_data: array(nested({
    name: str(),
    desc: opt(str(), ""),
    evidence: opt(str(), ""),
  })),
});
