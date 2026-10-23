import { PrdTemplate, requiredSectionIds } from "./templates";

export type PrdMeta = {
  title: string;
  author?: string;
  date?: string;
};

// Required section jo khaali hai, uski list lautata hai.
export function missingRequiredSections(
  template: PrdTemplate,
  answers: Record<string, string>,
): string[] {
  return requiredSectionIds(template).filter((id) => !answers[id]?.trim());
}

export function buildPrdMarkdown(
  template: PrdTemplate,
  answers: Record<string, string>,
  meta: PrdMeta,
): string {
  const lines: string[] = [
    `# ${meta.title}`,
    "",
    `**Type:** ${template.label}  `,
    `${meta.date ? `**Date:** ${meta.date}  \n` : ""}${meta.author ? `**Author:** ${meta.author}` : ""}`.trimEnd(),
    "",
  ];

  for (const section of template.sections) {
    const content = answers[section.id]?.trim();
    if (!content) continue; // optional section skip, slop nahi chahiye
    lines.push(`## ${section.title}`, "", content, "");
  }

  return lines.join("\n").trim() + "\n";
}
