import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";
import { getAllTemplates, getAnyTemplate } from "@/lib/template-store";

const handler = createMcpHandler((server) => {
  server.registerTool(
    "list_prd_templates",
    {
      title: "List PRD Templates",
      description:
        "Company ke standardised PRD categories list karo — built-in (New Feature, Enhancement, Bug Fix, Deprecation, Experiment) + team ke custom templates.",
      inputSchema: z.object({}),
    },
    async () => {
      const templates = await getAllTemplates();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              templates.map((t) => ({
                id: t.id,
                label: t.label,
                description: t.description,
                sectionCount: t.sections.length,
                custom: t.custom,
              })),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_prd_template",
    {
      title: "Get PRD Template",
      description:
        "Ek category ka full section structure do — required/optional sections, aur har section ke liye prompt guidance. Draft_prd call karne se pehle yeh use karo taaki pata ho PM se kya puchna hai. list_prd_templates se valid category ids milenge.",
      inputSchema: z.object({ category: z.string() }),
    },
    async ({ category }) => {
      const template = await getAnyTemplate(category);
      if (!template) {
        return { content: [{ type: "text", text: `Unknown category: ${category}` }], isError: true };
      }
      return { content: [{ type: "text", text: JSON.stringify(template, null, 2) }] };
    },
  );

  server.registerTool(
    "draft_prd",
    {
      title: "Draft PRD",
      description:
        "Category ke template structure follow karke standardised PRD markdown generate karo. 'sections' mein section id -> content map do (get_prd_template se section ids milenge). Required section missing ho to error aayega.",
      inputSchema: z.object({
        category: z.string(),
        title: z.string().min(1),
        author: z.string().optional(),
        sections: z.record(z.string(), z.string()),
      }),
    },
    async ({ category, title, author, sections }) => {
      const template = await getAnyTemplate(category);
      if (!template) {
        return { content: [{ type: "text", text: `Unknown category: ${category}` }], isError: true };
      }

      const missing = missingRequiredSections(template, sections);
      if (missing.length > 0) {
        const missingTitles = template.sections
          .filter((s) => missing.includes(s.id))
          .map((s) => `${s.id} ("${s.title}")`)
          .join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Missing required sections for "${template.label}": ${missingTitles}. PM se yeh sections pucho, phir dobara draft_prd call karo.`,
            },
          ],
          isError: true,
        };
      }

      const date = new Date().toISOString().slice(0, 10);
      const markdown = buildPrdMarkdown(template, sections, { title, author, date });
      return { content: [{ type: "text", text: markdown }] };
    },
  );
});

export { handler as GET, handler as POST };
