import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getSession } from "@/lib/session";
import { getAllTemplates } from "@/lib/template-store";
import { createCustomTemplate, newTemplateId, sanitizeSections } from "@/lib/db/custom-templates";

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
  const cleanSections = sanitizeSections(sections);
  if (cleanSections.length === 0) {
    return NextResponse.json({ error: "Kam se kam ek section chahiye" }, { status: 400 });
  }

  const template = await createCustomTemplate({
    id: newTemplateId(label),
    label: label.trim(),
    description: (description ?? "").trim(),
    sections: cleanSections,
    createdBy: session.user.id,
  });

  return NextResponse.json(template, { status: 201 });
}
