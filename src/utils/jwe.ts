import { JWTPayload, jwtDecrypt } from "jose";

function getBase64Key(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET as string;

  return Buffer.from(secret, "base64");
}

export async function jwtVerify(
  token: string
): Promise<JWTPayload | { error: string }> {
  const key = getBase64Key();

  const { payload } = await jwtDecrypt(token, key);

  if (payload.exp && Date.now() >= payload.exp * 1000)
    return { error: "Sessão expirada." };

  return payload;
}
