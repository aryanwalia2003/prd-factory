import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listCustomTemplatesWithOwner } from "@/lib/db/custom-templates";
import DeleteTemplateButton from "@/components/DeleteTemplateButton";

export const instant = false; // session check runtime pe hota hai

export default async function TemplatesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const templates = await listCustomTemplatesWithOwner();

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">Custom Templates</h1>
          <Link
            href="/templates/new"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700"
          >
            + New Template
          </Link>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          Team ke sab custom templates — built-in 5 yahan nahi, woh edit nahi hote.
        </p>

        <div className="mt-6 space-y-2">
          {templates.length === 0 && (
            <p className="text-sm text-zinc-500">Abhi koi custom template nahi hai.</p>
          )}
          {templates.map((t) => {
            const isOwner = t.createdBy === session.user.id;
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div>
                  <div className="font-medium text-zinc-900">{t.label}</div>
                  <p className="mt-1 text-sm text-zinc-600">{t.description}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {t.sections.length} sections · {t.createdByEmail ?? "unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/new/${t.id}`} className="text-sm text-zinc-600 hover:underline">
                    Use
                  </Link>
                  {isOwner && (
                    <>
                      <Link
                        href={`/templates/${t.id}/edit`}
                        className="text-sm text-zinc-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteTemplateButton id={t.id} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
