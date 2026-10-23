import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCustomTemplate, deleteCustomTemplate } from "@/lib/db/custom-templates";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const template = await getCustomTemplate(id);
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ok = await deleteCustomTemplate(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "Apka template nahi hai" }, { status: 403 });
  return NextResponse.json({ ok: true });
}
