import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listPrds, createPrd } from "@/lib/db/prds";
import { getAnyTemplate } from "@/lib/template-store";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  return NextResponse.json(await listPrds());
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = await req.json();
  const { categoryId, title, author, sections } = body ?? {};
  if (typeof categoryId !== "string" || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "categoryId aur title required hain" }, { status: 400 });
  }

  const template = await getAnyTemplate(categoryId);
  if (!template) return NextResponse.json({ error: "Unknown category" }, { status: 400 });

  const missing = missingRequiredSections(template, sections ?? {});
  if (missing.length > 0) {
    return NextResponse.json({ error: "Required sections missing", missing }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const markdown = buildPrdMarkdown(template, sections, { title, author, date });
  const id = await createPrd({
    categoryId,
    title,
    author,
    sections,
    markdown,
    createdBy: session.user.id,
  });

  return NextResponse.json({ id, markdown }, { status: 201 });
}
