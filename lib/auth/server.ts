import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import firebaseConfig from "../../firebase-applet-config.json";

const firebaseKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

function stableUserId(uid: string) {
  const bytes = createHash("sha256").update(`firebase:${uid}`).digest();
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export async function verifyFirebaseToken(token: string) {
  const { payload } = await jwtVerify(token, firebaseKeys, {
    algorithms: ["RS256"],
    issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
    audience: firebaseConfig.projectId,
  });
  if (payload.sub === "") throw new Error("Invalid Firebase subject");
  return {
    uid: String(payload.user_id || payload.sub),
    name: typeof payload.name === "string" ? payload.name : "User",
    email: typeof payload.email === "string" ? payload.email : "",
  };
}

export const auth = {
  getSession: async () => {
    const token = (await cookies()).get("firebaseToken")?.value;
    if (!token) return { data: { session: null, user: null } };
    try {
      const decoded = await verifyFirebaseToken(token);
      const id = stableUserId(decoded.uid);
      return { data: { session: { id }, user: { id, name: decoded.name, email: decoded.email } } };
    } catch (error) {
      console.warn("[v0] Firebase session verification failed", error instanceof Error ? error.message : error);
      return { data: { session: null, user: null } };
    }
  },
};
