/**
 * Tests RLS Supabase — vérification des policies anon
 * @jest-environment node
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://supa.bunnichrist.fr";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2OTgzNTI0MCwiZXhwIjo0OTI1NTA4ODQwLCJyb2xlIjoiYW5vbiJ9.e8O2rf7T8siaYfXWi_ZFXwkw12PZlDxVMfz1I4T3ydU";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2OTgzNTI0MCwiZXhwIjo0OTI1NTA4ODQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.T3xLq9nOw06U6JcYdhi9c9kGTsB4ucoajQ6QLob58L4";

// anonymat: aucune métadonnée stockée — test RLS uniquement
const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

describe("RLS — politique d'accès anon", () => {
  let insertedId: string | null = null;

  afterAll(async () => {
    // Nettoyage : supprime le row de test via admin
    if (insertedId) {
      await adminClient.from("responses").delete().eq("id", insertedId);
    }
  });

  it("anon peut INSERT une réponse valide", async () => {
    // anonymat: pas de .select() après insert — policy FOR INSERT uniquement
    // On vérifie le succès via le compteur avant/après
    const { data: before } = await anonClient
      .from("responses_count")
      .select("count")
      .single();
    const countBefore = before?.count ?? 0;

    const { error } = await anonClient
      .from("responses")
      .insert({ age: 30, gender: "femme", wish: "Test RLS anonymat" });
    expect(error).toBeNull();

    // Récupérer l'id via admin pour le nettoyage
    const { data: rows } = await adminClient
      .from("responses")
      .select("id")
      .eq("wish", "Test RLS anonymat")
      .limit(1)
      .single();
    if (rows) insertedId = rows.id;

    const { data: after } = await anonClient
      .from("responses_count")
      .select("count")
      .single();
    expect((after?.count ?? 0)).toBeGreaterThan(countBefore);
  }, 15000);

  it("anon ne peut pas SELECT sur la table responses", async () => {
    const { data, error } = await anonClient.from("responses").select("*");
    // Doit retourner soit une erreur, soit un tableau vide (RLS bloque le SELECT)
    if (error) {
      expect(error).toBeTruthy();
    } else {
      // Si pas d'erreur, la table doit retourner 0 lignes (RLS filtre tout)
      expect(data).toEqual([]);
    }
  }, 15000);

  it("anon peut lire le compteur via responses_count", async () => {
    const { data, error } = await anonClient
      .from("responses_count")
      .select("count")
      .single();
    expect(error).toBeNull();
    expect(typeof data?.count).toBe("number");
  }, 15000);

  it("admin peut SELECT toutes les réponses", async () => {
    const { data, error } = await adminClient
      .from("responses")
      .select("id")
      .limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  }, 15000);
});
