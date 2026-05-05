/**
 * @jest-environment node
 */

import {
  createResponsesBunniSessionToken,
  isMatchingResponsesBunniPassword,
  isValidResponsesBunniSessionToken,
} from "@/lib/reponsesbunni-auth";

describe("ReponsesBunni auth helpers", () => {
  const password = "mot-de-passe-bunni";

  it("accepts the configured password", () => {
    expect(isMatchingResponsesBunniPassword(password, password)).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(isMatchingResponsesBunniPassword("incorrect", password)).toBe(false);
  });

  it("validates a generated session token", () => {
    const token = createResponsesBunniSessionToken(password);
    expect(isValidResponsesBunniSessionToken(token, password)).toBe(true);
  });

  it("rejects a tampered session token", () => {
    const token = createResponsesBunniSessionToken(password);
    expect(
      isValidResponsesBunniSessionToken(`${token}tampered`, password)
    ).toBe(false);
  });
});
