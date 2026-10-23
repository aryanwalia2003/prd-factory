import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { customTemplate, user } from "./schema";
import type { PrdSection, PrdTemplate } from "@/lib/templates";

function toTemplate(row: typeof customTemplate.$inferSelect): PrdTemplate {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    sections: JSON.parse(row.sectionsJson) as PrdSection[],
    custom: true,
  };
}

// POST/PATCH body se aaye raw sections ko clean PrdSection[] banata hai.
export function sanitizeSections(sections: unknown): PrdSection[] {
  if (!Array.isArray(sections) || sections.length === 0) return [];
  return sections.map((s: Partial<PrdSection>, i: number) => ({
    id: (s.id?.trim() || `section-${i + 1}`).toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    title: s.title?.trim() || `Section ${i + 1}`,
    prompt: s.prompt?.trim() || "",
    required: Boolean(s.required),
  }));
}

export async function listCustomTemplates(): Promise<PrdTemplate[]> {
  const rows = await db.select().from(customTemplate);
  return rows.map(toTemplate);
}

// Management page ke liye — owner pata karne ke liye createdBy/email bhi saath.
export async function listCustomTemplatesWithOwner() {
  const rows = await db
    .select({ template: customTemplate, creatorEmail: user.email })
    .from(customTemplate)
    .leftJoin(user, eq(customTemplate.createdBy, user.id));
  return rows.map((r) => ({
    ...toTemplate(r.template),
    createdBy: r.template.createdBy,
    createdByEmail: r.creatorEmail,
  }));
}

export async function getCustomTemplate(id: string): Promise<PrdTemplate | undefined> {
  const [row] = await db.select().from(customTemplate).where(eq(customTemplate.id, id));
  return row ? toTemplate(row) : undefined;
}

export async function getCustomTemplateOwnerId(id: string): Promise<string | undefined> {
  const [row] = await db.select().from(customTemplate).where(eq(customTemplate.id, id));
  return row?.createdBy;
}

export async function createCustomTemplate(input: {
  id: string;
  label: string;
  description: string;
  sections: PrdSection[];
  createdBy: string;
}): Promise<PrdTemplate> {
  const now = new Date();
  await db.insert(customTemplate).values({
    id: input.id,
    label: input.label,
    description: input.description,
    sectionsJson: JSON.stringify(input.sections),
    createdBy: input.createdBy,
    createdAt: now,
  });
  return { id: input.id, label: input.label, description: input.description, sections: input.sections, custom: true };
}

export async function updateCustomTemplate(
  id: string,
  userId: string,
  input: { label: string; description: string; sections: PrdSection[] },
): Promise<boolean> {
  const [row] = await db.select().from(customTemplate).where(eq(customTemplate.id, id));
  if (!row || row.createdBy !== userId) return false;
  await db
    .update(customTemplate)
    .set({
      label: input.label,
      description: input.description,
      sectionsJson: JSON.stringify(input.sections),
    })
    .where(eq(customTemplate.id, id));
  return true;
}

export async function deleteCustomTemplate(id: string, userId: string): Promise<boolean> {
  const [row] = await db.select().from(customTemplate).where(eq(customTemplate.id, id));
  if (!row || row.createdBy !== userId) return false;
  await db.delete(customTemplate).where(eq(customTemplate.id, id));
  return true;
}

export function newTemplateId(label: string): string {
  const slug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "template"}-${randomUUID().slice(0, 6)}`;
}
