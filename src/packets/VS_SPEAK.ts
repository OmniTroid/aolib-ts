/**
 * VS_SPEAK — voice speak-state toggle. Bidirectional, asymmetric:
 *   Client → server: `{ on }`. Server attaches the source uid before
 *     rebroadcasting.
 *   Server → client: `{ uid, on }`. `uid` identifies which peer's
 *     speaking state changed.
 */
import { packet } from "../schema";
import { num, bool } from "../fields";

export const VS_SPEAKRequest = packet("VS_SPEAK", {
  on: bool(),
});

export const VS_SPEAKBroadcast = packet("VS_SPEAK", {
  uid: num(),
  on: bool(),
});
