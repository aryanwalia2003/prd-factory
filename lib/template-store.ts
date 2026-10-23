// Built-in (lib/templates.ts, static) + custom (DB, user-added) templates ka merged view.
import { PRD_TEMPLATES, getTemplate as getBuiltinTemplate, type PrdTemplate } from "./templates";
import { listCustomTemplates, getCustomTemplate } from "./db/custom-templates";

export async function getAllTemplates(): Promise<PrdTemplate[]> {
  const custom = await listCustomTemplates();
  return [...PRD_TEMPLATES, ...custom];
}

export async function getAnyTemplate(id: string): Promise<PrdTemplate | undefined> {
  return getBuiltinTemplate(id) ?? (await getCustomTemplate(id));
}
