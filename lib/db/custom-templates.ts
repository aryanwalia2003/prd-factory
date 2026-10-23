import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { customTemplate } from "./schema";
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

export async function listCustomTemplates(): Promise<PrdTemplate[]> {
  const rows = await db.select().from(customTemplate);
  return rows.map(toTemplate);
}

export async function getCustomTemplate(id: string): Promise<PrdTemplate | undefined> {
  const [row] = await db.select().from(customTemplate).where(eq(customTemplate.id, id));
  return row ? toTemplate(row) : undefined;
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
