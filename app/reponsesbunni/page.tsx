import { cookies } from "next/headers";
import {
  getResponsesBunniPassword,
  isValidResponsesBunniSessionToken,
  RESPONSES_BUNNI_COOKIE_NAME,
} from "@/lib/reponsesbunni-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  loginToResponsesBunni,
  logoutFromResponsesBunni,
} from "./actions";

type ResponsesPageSearchParams = Promise<{
  error?: string | string[];
}>;

type ResponseRow = {
  id: string;
  created_at: string;
  age: number;
  gender: string;
  wish: string;
};

export const dynamic = "force-dynamic";

function getErrorMessage(error: string | string[] | undefined): string | null {
  if (error === "invalid") {
    return "Mot de passe incorrect.";
  }

  return null;
}

async function getResponses(): Promise<ResponseRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("responses")
    .select("id, created_at, age, gender, wish")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Unable to load responses: ${error.message}`);
  }

  return data ?? [];
}

function LoginView({ errorMessage }: { errorMessage: string | null }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-gray-950/80 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-50">ReponsesBunni</h1>
          <p className="text-sm text-gray-400">
            Acces prive pour consulter les reponses dans l&apos;ordre d&apos;arrivee.
          </p>
        </div>

        <form action={loginToResponsesBunni} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Ouvrir les reponses
          </button>
        </form>
      </div>
    </main>
  );
}

function ResponsesTable({ rows }: { rows: ResponseRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950/80">
      <table className="min-w-full divide-y divide-gray-800 text-sm">
        <thead className="bg-gray-900/80 text-left text-gray-300">
          <tr>
            <th className="px-4 py-3 font-semibold">Arrivee</th>
            <th className="px-4 py-3 font-semibold">Age</th>
            <th className="px-4 py-3 font-semibold">Genre</th>
            <th className="px-4 py-3 font-semibold">Reponse</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-4 py-4 font-mono text-xs text-gray-400">
                {new Date(row.created_at).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "medium",
                })}
              </td>
              <td className="px-4 py-4 text-gray-100">{row.age}</td>
              <td className="px-4 py-4 text-gray-100 capitalize">
                {row.gender}
              </td>
              <td className="px-4 py-4 whitespace-pre-wrap text-gray-200">
                {row.wish}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ReponsesBunniPage({
  searchParams,
}: {
  searchParams: ResponsesPageSearchParams;
}) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const password = getResponsesBunniPassword();
  const sessionToken = cookieStore.get(RESPONSES_BUNNI_COOKIE_NAME)?.value;
  const isAuthenticated = isValidResponsesBunniSessionToken(
    sessionToken,
    password
  );

  if (!isAuthenticated) {
    return <LoginView errorMessage={getErrorMessage(params.error)} />;
  }

  const rows = await getResponses();

  return (
    <main className="flex flex-1 flex-col px-6 py-12 min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              ReponsesBunni
            </p>
            <h1 className="text-3xl font-bold text-gray-50">
              {rows.length} reponses
            </h1>
            <p className="text-sm text-gray-400">
              Liste brute dans l&apos;ordre d&apos;arrivee.
            </p>
          </div>

          <form action={logoutFromResponsesBunni}>
            <button
              type="submit"
              className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:text-gray-50"
            >
              Fermer la session
            </button>
          </form>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-950/80 px-6 py-10 text-center text-gray-400">
            Aucune reponse pour le moment.
          </div>
        ) : (
          <ResponsesTable rows={rows} />
        )}
      </div>
    </main>
  );
}
