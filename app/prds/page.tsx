import Link from "next/link";
import { getSession } from "@/lib/session";
import { listPrds } from "@/lib/db/prds";
import { redirect } from "next/navigation";

export const instant = false; // session check runtime pe hota hai

export default async function PrdsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; author?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { q = "", category = "", author = "" } = await searchParams;
  const all = await listPrds();

  const categories = [...new Set(all.map((p) => p.categoryId))].sort();
  const authors = [...new Set(all.map((p) => p.createdByEmail).filter((e): e is string => !!e))].sort();

  const prds = all.filter((p) => {
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (category && p.categoryId !== category) return false;
    if (author && p.createdByEmail !== author) return false;
    return true;
  });

  const hasFilter = Boolean(q || category || author);

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-zinc-900">Saved PRDs</h1>
        <p className="mt-1 text-sm text-zinc-600">Team ke sab saved PRDs — koi bhi dekh sakta hai.</p>

        <form method="get" className="mt-4 flex flex-wrap gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Title search..."
            className="flex-1 min-w-[160px] rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <select
            name="category"
            defaultValue={category}
            className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          >
            <option value="">Sab categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            name="author"
            defaultValue={author}
            className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          >
            <option value="">Sab authors</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Filter
          </button>
          {hasFilter && (
            <Link
              href="/prds"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="mt-6 space-y-2">
          {prds.length === 0 && (
            <p className="text-sm text-zinc-500">
              {hasFilter ? "Koi PRD match nahi hua." : "Abhi koi PRD save nahi hua."}
            </p>
          )}
          {prds.map((p) => (
            <Link
              key={p.id}
              href={`/prds/${p.id}`}
              className="block rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400"
            >
              <div className="font-medium text-zinc-900">{p.title}</div>
              <p className="mt-1 text-xs text-zinc-500">
                {p.categoryId} · {p.createdByEmail ?? "unknown"} ·{" "}
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
