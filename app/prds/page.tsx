import Link from "next/link";
import { getSession } from "@/lib/session";
import { listPrds } from "@/lib/db/prds";
import { redirect } from "next/navigation";

export const instant = false; // session check runtime pe hota hai

export default async function PrdsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const prds = await listPrds();

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-zinc-900">Saved PRDs</h1>
        <p className="mt-1 text-sm text-zinc-600">Team ke sab saved PRDs — koi bhi dekh sakta hai.</p>

        <div className="mt-6 space-y-2">
          {prds.length === 0 && (
            <p className="text-sm text-zinc-500">Abhi koi PRD save nahi hua.</p>
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
