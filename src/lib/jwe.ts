import { JWTPayload, jwtDecrypt } from "jose";
import crypto from "node:crypto";

function getA256GCMKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET as string;

  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

export async function jwtVerify(
  token: string
): Promise<JWTPayload | { error: string }> {
  const key = getA256GCMKey();

  const { payload } = await jwtDecrypt(token, key, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });

  if (payload.exp && Date.now() >= payload.exp * 1000)
    return { error: "Sessão expirada." };

  return payload;
}
