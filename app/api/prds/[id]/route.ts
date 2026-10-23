import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPrd, deletePrd } from "@/lib/db/prds";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const row = await getPrd(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const ok = await deletePrd(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "Not found ya apka nahi hai" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
