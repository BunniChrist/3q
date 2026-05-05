"use client";
// anonymat: aucune métadonnée stockée — insertion client-side anon key uniquement

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Step = "form" | "recap" | "done";

interface FormData {
  age: string;
  gender: "homme" | "femme" | "";
  wish: string;
}

interface FormErrors {
  age?: string;
  gender?: string;
  wish?: string;
}

export default function FormulaireePage() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    wish: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalCount, setFinalCount] = useState<number | null>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    const age = parseInt(formData.age, 10);
    if (!formData.age || isNaN(age) || age < 1 || age > 120) {
      e.age = "L'âge doit être entre 1 et 120.";
    }
    if (!formData.gender) {
      e.gender = "Veuillez choisir un genre.";
    }
    if (!formData.wish.trim()) {
      e.wish = "Le vœu ne peut pas être vide.";
    }
    if (formData.wish.length > 2000) {
      e.wish = "Le vœu dépasse 2000 caractères.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) setStep("recap");
  }

  async function handleConfirm() {
    // anonymat: aucune métadonnée stockée — payload minimal
    setLoading(true);
    setSubmitError(null);
    const { error } = await supabase.from("responses").insert({
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      wish: formData.wish.trim(),
    });
    if (error) {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
      return;
    }
    // Rafraîchir le compteur
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
              Merci pour votre réponse
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Votre vœu a été enregistré de façon totalement anonyme. Il ne sera
              jamais associé à votre identité, votre adresse IP, ni aucune donnée
              vous concernant.
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
              Vérifiez vos réponses avant d&apos;envoyer.
            </p>
          </div>

          <div className="border border-gray-700 rounded-lg divide-y divide-gray-700 bg-gray-900">
            <div className="px-6 py-4 flex justify-between">
              <span className="text-gray-400 text-sm">Âge</span>
              <span className="text-gray-100 font-medium">{formData.age} ans</span>
            </div>
            <div className="px-6 py-4 flex justify-between">
              <span className="text-gray-400 text-sm">Genre</span>
              <span className="text-gray-100 font-medium capitalize">
                {formData.gender}
              </span>
            </div>
            <div className="px-6 py-4 space-y-2">
              <span className="text-gray-400 text-sm block">Vœu</span>
              <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                {formData.wish}
              </p>
            </div>
          </div>

          {submitError && (
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep("form")}
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

  // Étape 1 : formulaire
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
      <div className="max-w-xl w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-50">Vos réponses</h1>
          <p className="text-gray-400 text-sm">
            Ces informations sont anonymes et ne permettront jamais de vous
            identifier.
          </p>
        </div>

        <div className="space-y-6">
          {/* Âge */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Âge
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={formData.age}
              onChange={(e) =>
                setFormData((d) => ({ ...d, age: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Votre âge"
            />
            {errors.age && (
              <p className="text-red-400 text-xs">{errors.age}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Genre
            </label>
            <div className="flex gap-4">
              {(["homme", "femme"] as const).map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
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
                    onChange={() =>
                      setFormData((d) => ({ ...d, gender: g }))
                    }
                    className="sr-only"
                  />
                  <span className="capitalize font-medium">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-400 text-xs">{errors.gender}</p>
            )}
          </div>

          {/* Vœu */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Votre vœu
            </label>
            <textarea
              value={formData.wish}
              onChange={(e) =>
                setFormData((d) => ({ ...d, wish: e.target.value }))
              }
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Exprimez librement votre vœu…"
            />
            <div className="flex justify-between text-xs text-gray-500">
              {errors.wish ? (
                <span className="text-red-400">{errors.wish}</span>
              ) : (
                <span />
              )}
              <span className="font-mono">{formData.wish.length} / 2000</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Continuer
        </button>
      </div>
    </main>
  );
}
