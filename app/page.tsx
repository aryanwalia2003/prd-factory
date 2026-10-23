import Link from "next/link";
import { connection } from "next/server";
import { getAllTemplates } from "@/lib/template-store";

export const instant = false; // runtime pe fetch hota hai, blocking render theek hai

export default async function Home() {
  await connection(); // custom templates DB se aate hain, build-time cache nahi
  const templates = await getAllTemplates();
  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PRD Studio</h1>
        <p className="mt-2 text-zinc-600">
          Apna PRD type chuno. Har template ke sections already decide hain — bas content bharo.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/new/${t.id}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
            >
              <div className="font-medium text-zinc-900">
                {t.label} {t.custom && <span className="text-xs text-zinc-400">(custom)</span>}
              </div>
              <p className="mt-1 text-sm text-zinc-600">{t.description}</p>
              <p className="mt-2 text-xs text-zinc-400">{t.sections.length} sections</p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs text-zinc-400">
          Same templates MCP se bhi available hain — <code className="font-mono">/api/mcp</code>.
        </p>
      </div>
    </main>
  );
}
