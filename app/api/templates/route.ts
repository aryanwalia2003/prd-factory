import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAllTemplates } from "@/lib/template-store";
import { createCustomTemplate, newTemplateId } from "@/lib/db/custom-templates";
import { connection } from "next/server";
import type { PrdSection } from "@/lib/templates";

export async function GET() {
  await connection(); // DB se aata hai, build-time cache nahi
  return NextResponse.json(await getAllTemplates());
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = await req.json();
  const { label, description, sections } = body ?? {};
  if (typeof label !== "string" || label.trim() === "") {
    return NextResponse.json({ error: "Label required hai" }, { status: 400 });
  }
  if (!Array.isArray(sections) || sections.length === 0) {
    return NextResponse.json({ error: "Kam se kam ek section chahiye" }, { status: 400 });
  }
  const cleanSections: PrdSection[] = sections.map((s: Partial<PrdSection>, i: number) => ({
    id: (s.id?.trim() || `section-${i + 1}`).toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    title: s.title?.trim() || `Section ${i + 1}`,
    prompt: s.prompt?.trim() || "",
    required: Boolean(s.required),
  }));

  const template = await createCustomTemplate({
    id: newTemplateId(label),
    label: label.trim(),
    description: (description ?? "").trim(),
    sections: cleanSections,
    createdBy: session.user.id,
  });

  return NextResponse.json(template, { status: 201 });
}
