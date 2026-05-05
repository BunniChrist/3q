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
            Un formulaire 100% anonyme.
          </p>
        </div>

        {/* Bloc anonymat */}
        <div className="border border-gray-700 rounded-lg bg-gray-900">
          <details>
            <summary className="px-6 py-4 cursor-pointer text-sm font-semibold uppercase tracking-widest text-gray-400 select-none list-none flex items-center justify-between">
              Anonymat total — techniquement vérifié
              <span className="text-gray-600 text-xs normal-case tracking-normal font-normal">voir détails</span>
            </summary>
            <ul className="px-6 pb-5 space-y-2 text-gray-300 text-sm border-t border-gray-700 pt-4">
              <li>— Aucune adresse IP ni identifiant stocké</li>
              <li>— Aucun cookie, aucun localStorage identifiant</li>
              <li>— Aucun service d&apos;analytics tiers</li>
              <li>— Politique RLS : insertion uniquement, zéro lecture des données</li>
              <li>— Code source vérifiable</li>
            </ul>
          </details>
        </div>

        {/* Les 3 questions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Voici les 3 questions</h2>
          <ol className="space-y-3 text-gray-300 text-sm list-none">
            <li className="flex gap-3">
              <span className="text-indigo-400 font-mono font-bold shrink-0">1.</span>
              <span>Quel est ton âge ?</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-mono font-bold shrink-0">2.</span>
              <span>Quel est ton genre ?</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-mono font-bold shrink-0">3.</span>
              <span>Si Dieu t&apos;appelle, Il te dit que tu peux lui demander tout ce que tu veux et tu l&apos;auras dans 1 an jour pour jour, mais que tu dois demander qu&apos;une seule chose, qu&apos;est-ce que tu demandes ?</span>
            </li>
          </ol>
          <p className="text-gray-500 text-sm">
            Ce formulaire se fait en 3 minutes et tu pourras aider d&apos;autres.
          </p>
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
