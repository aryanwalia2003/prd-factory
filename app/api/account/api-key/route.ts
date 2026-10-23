import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getApiKeyForUser, generateApiKeyForUser } from "@/lib/db/api-keys";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const token = await getApiKeyForUser(session.user.id);
  return NextResponse.json({ token: token ?? null });
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const token = await generateApiKeyForUser(session.user.id);
  return NextResponse.json({ token });
}
