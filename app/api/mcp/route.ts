import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { PRD_CATEGORY_IDS, PRD_TEMPLATES, getTemplate } from "@/lib/templates";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";

const categoryEnum = z.enum(PRD_CATEGORY_IDS);

const handler = createMcpHandler((server) => {
  server.registerTool(
    "list_prd_templates",
    {
      title: "List PRD Templates",
      description:
        "Company ke standardised PRD categories list karo (New Feature, Enhancement, Bug Fix, Deprecation, Experiment).",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            PRD_TEMPLATES.map((t) => ({
              id: t.id,
              label: t.label,
              description: t.description,
              sectionCount: t.sections.length,
            })),
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerTool(
    "get_prd_template",
    {
      title: "Get PRD Template",
      description:
        "Ek category ka full section structure do — required/optional sections, aur har section ke liye prompt guidance. Draft_prd call karne se pehle yeh use karo taaki pata ho PM se kya puchna hai.",
      inputSchema: z.object({ category: categoryEnum }),
    },
    async ({ category }) => {
      const template = getTemplate(category);
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
        category: categoryEnum,
        title: z.string().min(1),
        author: z.string().optional(),
        sections: z.record(z.string(), z.string()),
      }),
    },
    async ({ category, title, author, sections }) => {
      const template = getTemplate(category);
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
