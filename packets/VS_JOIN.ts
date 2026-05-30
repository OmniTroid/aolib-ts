/**
 * VS_JOIN — voice peer join. Bidirectional, asymmetric:
 *   Client → server: empty payload (server attaches the source uid).
 *   Server → client: `{ uid }` — the joining peer's uid.
 */
import { packet } from "../schema";
import { num } from "../fields";

export const VS_JOINRequest = packet("VS_JOIN", {});

export const VS_JOINBroadcast = packet("VS_JOIN", {
  uid: num(),
});
