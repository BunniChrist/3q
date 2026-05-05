"use client";
// anonymat: aucune métadonnée stockée — insertion client-side anon key uniquement

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Step = "age" | "genre" | "wish" | "recap" | "done";

interface FormData {
  age: string;
  gender: "homme" | "femme" | "";
  wish: string;
}

const QUESTION_WISH =
  "Si Dieu t'appelle, Il te dit que tu peux lui demander tout ce que tu veux et tu l'auras dans 1 an jour pour jour, mais que tu dois demander qu'une seule chose, qu'est-ce que tu demandes ?";

export default function FormulaireePage() {
  const [step, setStep] = useState<Step>("age");
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    wish: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [finalCount, setFinalCount] = useState<number | null>(null);

  function validateAge(): boolean {
    const age = parseInt(formData.age, 10);
    if (!formData.age || isNaN(age) || age < 1 || age > 120) {
      setError("L'âge doit être entre 1 et 120.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateGender(): boolean {
    if (!formData.gender) {
      setError("Veuillez choisir un genre.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateWish(): boolean {
    if (!formData.wish.trim()) {
      setError("La réponse ne peut pas être vide.");
      return false;
    }
    if (formData.wish.length > 2000) {
      setError("La réponse dépasse 2000 caractères.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleNextAge() {
    if (validateAge()) setStep("genre");
  }

  function handleNextGenre() {
    if (validateGender()) setStep("wish");
  }

  function handleNextWish() {
    if (validateWish()) setStep("recap");
  }

  async function handleConfirm() {
    // anonymat: aucune métadonnée stockée — payload minimal
    setLoading(true);
    setError(null);
    const { error: insertError } = await supabase.from("responses").insert({
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      wish: formData.wish.trim(),
    });
    if (insertError) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("responses_count")
      .select("count")
      .single();
    setFinalCount(data?.count ?? null);
    setStep("done");
    setLoading(false);
  }

  if (step === "done") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
        <div className="max-w-xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="text-5xl">🕊</div>
            <h1 className="text-3xl font-bold text-gray-50">
              Merci pour ta réponse
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Ton vœu a été enregistré de façon totalement anonyme. Il ne sera
              jamais associé à ton identité, ton adresse IP, ni aucune donnée
              te concernant.
            </p>
            {finalCount !== null && (
              <p className="text-indigo-400 font-mono text-sm">
                {finalCount} réponses collectées au total
              </p>
            )}
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-gray-100 rounded-lg transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  if (step === "recap") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
        <div className="max-w-xl w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-50">Récapitulatif</h1>
            <p className="text-gray-400 text-sm">
              Vérifie tes réponses avant d&apos;envoyer.
            </p>
          </div>

          <div className="border border-gray-700 rounded-lg divide-y divide-gray-700 bg-gray-900">
            <div className="px-6 py-4 space-y-1">
              <span className="text-gray-400 text-xs block">Quel est ton âge ?</span>
              <span className="text-gray-100 font-medium">{formData.age} ans</span>
            </div>
            <div className="px-6 py-4 space-y-1">
              <span className="text-gray-400 text-xs block">Quel est ton genre ?</span>
              <span className="text-gray-100 font-medium capitalize">{formData.gender}</span>
            </div>
            <div className="px-6 py-4 space-y-2">
              <span className="text-gray-400 text-xs block">{QUESTION_WISH}</span>
              <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                {formData.wish}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep("wish")}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Modifier
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Envoi…" : "Confirmer l'envoi"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Questions une par une
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
      <div className="max-w-xl w-full space-y-8">

        {/* Indicateur de progression */}
        <div className="flex gap-2">
          {(["age", "genre", "wish"] as const).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === s || (i === 0 && step === "age") || (i === 1 && step === "genre") || (i === 2 && step === "wish")
                  ? "bg-indigo-500"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Question âge */}
        {step === "age" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Question 1 / 3</p>
              <h1 className="text-xl font-bold text-gray-50">Quel est ton âge ?</h1>
            </div>
            <input
              type="number"
              min={1}
              max={120}
              value={formData.age}
              onChange={(e) => {
                setFormData((d) => ({ ...d, age: e.target.value }));
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleNextAge()}
              autoFocus
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Ton âge"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleNextAge}
              className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Suivant
            </button>
          </div>
        )}

        {/* Question genre */}
        {step === "genre" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Question 2 / 3</p>
              <h1 className="text-xl font-bold text-gray-50">Quel est ton genre ?</h1>
            </div>
            <div className="flex gap-4">
              {(["homme", "femme"] as const).map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center px-4 py-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.gender === g
                      ? "border-indigo-500 bg-indigo-900/30 text-indigo-300"
                      : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={() => {
                      setFormData((d) => ({ ...d, gender: g }));
                      setError(null);
                    }}
                    className="sr-only"
                  />
                  <span className="capitalize font-medium text-lg">{g}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-4">
              <button
                onClick={() => setStep("age")}
                className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-gray-100 rounded-lg transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleNextGenre}
                className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Question vœu */}
        {step === "wish" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Question 3 / 3</p>
              <h1 className="text-xl font-bold text-gray-50 leading-snug">{QUESTION_WISH}</h1>
            </div>
            <textarea
              value={formData.wish}
              onChange={(e) => {
                setFormData((d) => ({ ...d, wish: e.target.value }));
                setError(null);
              }}
              rows={6}
              maxLength={2000}
              autoFocus
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Réponds librement…"
            />
            <div className="flex justify-between text-xs text-gray-500">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <span />
              )}
              <span className="font-mono">{formData.wish.length} / 2000</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep("genre")}
                className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-gray-100 rounded-lg transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleNextWish}
                className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Voir le récapitulatif
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
