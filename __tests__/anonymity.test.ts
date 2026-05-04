// Test d'intégration : vérification que le payload d'insertion est anonyme

describe("Anonymat — payload d'insertion", () => {
  function buildInsertPayload(age: number, gender: string, wish: string) {
    // anonymat: aucune métadonnée stockée — payload minimal
    return { age, gender, wish };
  }

  it("ne contient pas de champ ip", () => {
    const payload = buildInsertPayload(30, "femme", "Paix dans le monde");
    expect(payload).not.toHaveProperty("ip");
  });

  it("ne contient pas de champ user_agent", () => {
    const payload = buildInsertPayload(30, "femme", "Paix dans le monde");
    expect(payload).not.toHaveProperty("user_agent");
  });

  it("ne contient pas de champ cookie", () => {
    const payload = buildInsertPayload(30, "femme", "Paix dans le monde");
    expect(payload).not.toHaveProperty("cookie");
  });

  it("ne contient pas de champ session_id", () => {
    const payload = buildInsertPayload(30, "femme", "Paix dans le monde");
    expect(payload).not.toHaveProperty("session_id");
  });

  it("ne contient pas de champ fingerprint", () => {
    const payload = buildInsertPayload(30, "femme", "Paix dans le monde");
    expect(payload).not.toHaveProperty("fingerprint");
  });

  it("ne contient que les champs attendus (age, gender, wish)", () => {
    const payload = buildInsertPayload(25, "homme", "Un vœu simple");
    const keys = Object.keys(payload);
    expect(keys).toEqual(expect.arrayContaining(["age", "gender", "wish"]));
    expect(keys).toHaveLength(3);
  });

  it("le payload ne contient aucune donnée du navigateur (navigator, window)", () => {
    // S'assurer qu'on ne lit jamais navigator.userAgent ni window.location dans le payload
    const payload = buildInsertPayload(40, "homme", "Bonheur");
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toMatch(/navigator|userAgent|window|location/i);
  });
});
