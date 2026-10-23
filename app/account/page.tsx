import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ApiKeyPanel from "@/components/ApiKeyPanel";

export const instant = false; // session check runtime pe hota hai

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-zinc-900">Account</h1>
        <p className="mt-1 text-sm text-zinc-600">{session.user.email}</p>

        <div className="mt-6">
          <ApiKeyPanel />
          <p className="mt-2 text-xs text-zinc-500">
            MCP ka <code className="font-mono">save_prd</code> tool call karte waqt yeh key{" "}
            <code className="font-mono">apiKey</code> param mein do — PRD tumhare account se save ho jaayega.
          </p>
        </div>
      </div>
    </main>
  );
}
