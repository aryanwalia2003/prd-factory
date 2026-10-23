import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPrd } from "@/lib/db/prds";
import DeletePrdButton from "@/components/DeletePrdButton";

export const instant = false; // session check runtime pe hota hai

export default async function PrdViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const row = await getPrd(id);
  if (!row) notFound();

  const isOwner = row.createdBy === session.user.id;

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/prds" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Back
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">{row.title}</h1>
          {isOwner && (
            <div className="flex items-center gap-3">
              <Link href={`/prds/${row.id}/edit`} className="text-sm text-zinc-600 hover:underline">
                Edit
              </Link>
              <DeletePrdButton id={row.id} />
            </div>
          )}
        </div>
        <pre className="mt-6 overflow-auto rounded-md border border-zinc-200 bg-white p-4 text-xs leading-relaxed whitespace-pre-wrap text-zinc-800">
          {row.markdown}
        </pre>
      </div>
    </main>
  );
}
