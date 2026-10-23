"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Row = { id: string; title: string; prompt: string; required: boolean };

type ExistingTemplate = {
  id: string;
  label: string;
  description: string;
  sections: Row[];
};

export default function TemplateForm({ existing }: { existing?: ExistingTemplate }) {
  const router = useRouter();
  const [label, setLabel] = useState(existing?.label ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [sections, setSections] = useState<Row[]>(
    existing?.sections ?? [{ id: "", title: "", prompt: "", required: true }],
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateRow(i: number, patch: Partial<Row>) {
    setSections((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setSections((prev) => [...prev, { id: "", title: "", prompt: "", required: false }]);
  }

  function removeRow(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = existing ? `/api/templates/${existing.id}` : "/api/templates";
    const res = await fetch(url, {
      method: existing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, description, sections }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save nahi hua");
      return;
    }
    const template = await res.json();
    router.push(existing ? "/templates" : `/new/${template.id}`);
  }

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/templates" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Back
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900">
          {existing ? "Template Edit Karo" : "Naya Template"}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Apna PRD structure define karo — sections add karo, required/optional mark karo.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <input
            required
            placeholder="Template label — e.g. Incident Postmortem"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <input
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />

          <div className="space-y-3">
            {sections.map((row, i) => (
              <div key={i} className="rounded-md border border-zinc-200 bg-white p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    placeholder="Section title — e.g. Impact"
                    value={row.title}
                    onChange={(e) => updateRow(i, { title: e.target.value })}
                    className="flex-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                  />
                  <label className="flex items-center gap-1 text-xs text-zinc-600">
                    <input
                      type="checkbox"
                      checked={row.required}
                      onChange={(e) => updateRow(i, { required: e.target.checked })}
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <input
                  placeholder="Prompt / guidance for this section"
                  value={row.prompt}
                  onChange={(e) => updateRow(i, { prompt: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            + Section
          </button>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : existing ? "Update Template" : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
