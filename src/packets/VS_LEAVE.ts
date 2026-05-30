/**
 * VS_LEAVE — voice peer leave. Bidirectional, asymmetric:
 *   Client → server: empty payload (server attaches the source uid).
 *   Server → client: `{ uid }` — the leaving peer's uid.
 */
import { packet } from "../schema";
import { num } from "../fields";

export const VS_LEAVERequest = packet("VS_LEAVE", {});

export const VS_LEAVEBroadcast = packet("VS_LEAVE", {
  uid: num(),
});
