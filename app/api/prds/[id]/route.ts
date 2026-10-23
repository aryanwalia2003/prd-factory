import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPrd, updatePrd, deletePrd } from "@/lib/db/prds";
import { getAnyTemplate } from "@/lib/template-store";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const row = await getPrd(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;

  const existing = await getPrd(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.createdBy !== session.user.id) {
    return NextResponse.json({ error: "Apka PRD nahi hai" }, { status: 403 });
  }

  const body = await req.json();
  const { title, author, sections } = body ?? {};
  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Title required hai" }, { status: 400 });
  }

  const template = await getAnyTemplate(existing.categoryId);
  if (!template) return NextResponse.json({ error: "Unknown category" }, { status: 400 });

  const missing = missingRequiredSections(template, sections ?? {});
  if (missing.length > 0) {
    return NextResponse.json({ error: "Required sections missing", missing }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const markdown = buildPrdMarkdown(template, sections, { title, author, date });
  const ok = await updatePrd(id, session.user.id, { title, author, sections, markdown });
  if (!ok) return NextResponse.json({ error: "Update nahi hua" }, { status: 404 });

  return NextResponse.json({ id, markdown });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const ok = await deletePrd(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "Not found ya apka nahi hai" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
