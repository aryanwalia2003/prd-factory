"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn.email({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Login fail hua, dobara try karo.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-sm px-6 py-16">
        <h1 className="text-xl font-semibold text-zinc-900">Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-600">
          Account nahi hai?{" "}
          <Link href="/signup" className="text-zinc-900 underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
