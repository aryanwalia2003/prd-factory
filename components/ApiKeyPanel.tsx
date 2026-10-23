"use client";

import { useEffect, useState } from "react";

export default function ApiKeyPanel() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/account/api-key")
      .then((r) => r.json())
      .then((d) => setToken(d.token));
  }, []);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/account/api-key", { method: "POST" });
    const d = await res.json();
    setToken(d.token);
    setLoading(false);
  }

  async function copy() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">MCP API Key</span>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
        >
          {loading ? "..." : token ? "Regenerate" : "Generate"}
        </button>
      </div>

      {token === undefined && <p className="mt-2 text-xs text-zinc-400">Loading...</p>}
      {token === null && (
        <p className="mt-2 text-xs text-zinc-500">
          Abhi koi key nahi hai — &quot;Generate&quot; dabao MCP se PRD save karne ke liye.
        </p>
      )}
      {token && (
        <>
          <div className="mt-2 flex gap-2">
            <code className="flex-1 overflow-x-auto rounded-md bg-zinc-100 px-2 py-1.5 text-xs text-zinc-800">
              {token}
            </code>
            <button
              onClick={copy}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Regenerate karoge to purani key kaam nahi karegi.
          </p>
        </>
      )}
    </div>
  );
}
