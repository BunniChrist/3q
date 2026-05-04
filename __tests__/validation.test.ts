// Tests unitaires de validation des champs du formulaire

function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 120;
}

function validateGender(gender: string): boolean {
  return gender === "homme" || gender === "femme";
}

function validateWish(wish: string): { valid: boolean; error?: string } {
  if (!wish.trim()) return { valid: false, error: "Le vœu ne peut pas être vide." };
  if (wish.length > 2000)
    return { valid: false, error: "Le vœu dépasse 2000 caractères." };
  return { valid: true };
}

describe("Validation — âge", () => {
  it("accepte un âge valide (25)", () => {
    expect(validateAge(25)).toBe(true);
  });
  it("accepte la valeur limite basse (1)", () => {
    expect(validateAge(1)).toBe(true);
  });
  it("accepte la valeur limite haute (120)", () => {
    expect(validateAge(120)).toBe(true);
  });
  it("rejette 0", () => {
    expect(validateAge(0)).toBe(false);
  });
  it("rejette 121", () => {
    expect(validateAge(121)).toBe(false);
  });
  it("rejette un nombre négatif", () => {
    expect(validateAge(-5)).toBe(false);
  });
});

describe("Validation — genre", () => {
  it("accepte 'homme'", () => {
    expect(validateGender("homme")).toBe(true);
  });
  it("accepte 'femme'", () => {
    expect(validateGender("femme")).toBe(true);
  });
  it("rejette 'Homme' (casse)", () => {
    expect(validateGender("Homme")).toBe(false);
  });
  it("rejette une chaîne vide", () => {
    expect(validateGender("")).toBe(false);
  });
  it("rejette 'autre'", () => {
    expect(validateGender("autre")).toBe(false);
  });
});

describe("Validation — vœu", () => {
  it("accepte un vœu normal", () => {
    expect(validateWish("Je souhaite la paix.").valid).toBe(true);
  });
  it("rejette un vœu vide", () => {
    expect(validateWish("").valid).toBe(false);
  });
  it("rejette un vœu composé d'espaces", () => {
    expect(validateWish("   ").valid).toBe(false);
  });
  it("accepte exactement 2000 caractères", () => {
    expect(validateWish("a".repeat(2000)).valid).toBe(true);
  });
  it("rejette 2001 caractères", () => {
    expect(validateWish("a".repeat(2001)).valid).toBe(false);
  });
});
