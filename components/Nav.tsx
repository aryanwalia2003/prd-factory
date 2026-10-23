"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Nav() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-sm font-semibold text-zinc-900">
          PRD Studio
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {!isPending && session && (
            <>
              <Link href="/prds" className="text-zinc-600 hover:text-zinc-900">
                My PRDs
              </Link>
              <Link href="/templates" className="text-zinc-600 hover:text-zinc-900">
                Templates
              </Link>
              <Link href="/account" className="text-zinc-600 hover:text-zinc-900">
                Account
              </Link>
              <span className="text-zinc-400">{session.user.email}</span>
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                  router.refresh();
                }}
                className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-700 hover:bg-zinc-100"
              >
                Logout
              </button>
            </>
          )}
          {!isPending && !session && (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
