import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  getCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
  sanitizeSections,
} from "@/lib/db/custom-templates";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await getCustomTemplate(id);
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;

  const existing = await getCustomTemplate(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { label, description, sections } = body ?? {};
  if (typeof label !== "string" || label.trim() === "") {
    return NextResponse.json({ error: "Label required hai" }, { status: 400 });
  }
  const cleanSections = sanitizeSections(sections);
  if (cleanSections.length === 0) {
    return NextResponse.json({ error: "Kam se kam ek section chahiye" }, { status: 400 });
  }

  const ok = await updateCustomTemplate(id, session.user.id, {
    label: label.trim(),
    description: (description ?? "").trim(),
    sections: cleanSections,
  });
  if (!ok) return NextResponse.json({ error: "Apka template nahi hai" }, { status: 403 });

  return NextResponse.json(await getCustomTemplate(id));
}

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
