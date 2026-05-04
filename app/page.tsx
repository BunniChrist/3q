// anonymat: aucune métadonnée stockée
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getCount(): Promise<number> {
  // anonymat: lecture du compteur uniquement, aucune donnée personnelle
  const { data, error } = await supabase
    .from("responses_count")
    .select("count")
    .single();
  if (error || !data) return 0;
  return data.count ?? 0;
}

export const revalidate = 60;

export default async function Home() {
  const count = await getCount();
  const goal = 500;
  const pct = Math.min(100, Math.round((count / goal) * 100));

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
      <div className="max-w-xl w-full space-y-10">
        {/* Titre */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-50">
            3 Questions
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Un formulaire entièrement anonyme.
          </p>
        </div>

        {/* Bloc anonymat */}
        <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Anonymat total — techniquement vérifié
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>— Aucune adresse IP ni identifiant stocké</li>
            <li>— Aucun cookie, aucun localStorage identifiant</li>
            <li>— Aucun service d&apos;analytics tiers</li>
            <li>— Politique RLS : insertion uniquement, zéro lecture des données</li>
            <li>— Code source vérifiable</li>
          </ul>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Réponses collectées</span>
            <span className="font-mono">
              {count} / {goal}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{pct}% de l&apos;objectif</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/formulaire"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg tracking-wide"
          >
            Commencer
          </Link>
        </div>
      </div>
    </main>
  );
}
