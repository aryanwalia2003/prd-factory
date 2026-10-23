"use client";

import { useState } from "react";
import Link from "next/link";
import { PrdTemplate } from "@/lib/templates";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";

export default function PrdForm({ template }: { template: PrdTemplate }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const missing = missingRequiredSections(template, answers);
  const markdown = buildPrdMarkdown(template, answers, {
    title: title || "Untitled PRD",
    author: author || undefined,
  });
  const canExport = title.trim().length > 0 && missing.length === 0;

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "untitled-prd").toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Back
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">{template.label}</h1>
        <p className="mt-1 text-sm text-zinc-600">{template.description}</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <Field label="Title" required>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bulk invoice export"
              />
            </Field>
            <Field label="Author">
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="optional"
              />
            </Field>

            {template.sections.map((section) => (
              <Field key={section.id} label={section.title} required={section.required}>
                <textarea
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  rows={4}
                  value={answers[section.id] ?? ""}
                  onChange={(e) => setAnswer(section.id, e.target.value)}
                  placeholder={section.prompt}
                />
              </Field>
            ))}
          </div>

          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  disabled={!canExport}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={download}
                  disabled={!canExport}
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download .md
                </button>
              </div>
            </div>

            {missing.length > 0 && (
              <p className="mt-2 text-xs text-amber-600">
                Required aur bhi bharo:{" "}
                {template.sections
                  .filter((s) => missing.includes(s.id))
                  .map((s) => s.title)
                  .join(", ")}
              </p>
            )}

            <pre className="mt-3 h-[70vh] overflow-auto rounded-md border border-zinc-200 bg-white p-4 text-xs leading-relaxed whitespace-pre-wrap text-zinc-800">
              {markdown}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">
        {label} {required && <span className="text-amber-600">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
