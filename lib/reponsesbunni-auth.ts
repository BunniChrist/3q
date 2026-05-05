import { createHash, createHmac, timingSafeEqual } from "crypto";

export const RESPONSES_BUNNI_COOKIE_NAME = "reponsesbunni_session";
export const RESPONSES_BUNNI_COOKIE_PATH = "/reponsesbunni";

const SESSION_SALT = "reponsesbunni-session-v1";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function getResponsesBunniPassword(): string {
  const password = process.env.RESPONSES_BUNNI_PASSWORD;
  if (!password) {
    throw new Error("RESPONSES_BUNNI_PASSWORD is not configured.");
  }
  return password;
}

export function isMatchingResponsesBunniPassword(
  input: string,
  expectedPassword: string
): boolean {
  return timingSafeEqual(sha256(input), sha256(expectedPassword));
}

export function createResponsesBunniSessionToken(password: string): string {
  return createHmac("sha256", password).update(SESSION_SALT).digest("hex");
}

export function isValidResponsesBunniSessionToken(
  token: string | undefined,
  password: string
): boolean {
  if (!token) {
    return false;
  }

  const expected = createResponsesBunniSessionToken(password);
  if (token.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
