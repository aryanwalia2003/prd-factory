import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { buildPrdMarkdown, missingRequiredSections } from "@/lib/markdown";
import { getAllTemplates, getAnyTemplate } from "@/lib/template-store";
import { getUserIdForApiKey } from "@/lib/db/api-keys";
import { createPrd } from "@/lib/db/prds";
import type { PrdTemplate } from "@/lib/templates";

// draft_prd aur save_prd dono ye hi validate+build karte hain.
function validateAndBuild(
  template: PrdTemplate,
  sections: Record<string, string>,
  meta: { title: string; author?: string },
): { error: string } | { markdown: string } {
  const missing = missingRequiredSections(template, sections);
  if (missing.length > 0) {
    const missingTitles = template.sections
      .filter((s) => missing.includes(s.id))
      .map((s) => `${s.id} ("${s.title}")`)
      .join(", ");
    return {
      error: `Missing required sections for "${template.label}": ${missingTitles}. PM se yeh sections pucho, phir dobara call karo.`,
    };
  }
  const date = new Date().toISOString().slice(0, 10);
  return { markdown: buildPrdMarkdown(template, sections, { title: meta.title, author: meta.author, date }) };
}

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

      const result = validateAndBuild(template, sections, { title, author });
      if ("error" in result) {
        return { content: [{ type: "text", text: result.error }], isError: true };
      }
      return { content: [{ type: "text", text: result.markdown }] };
    },
  );

  server.registerTool(
    "save_prd",
    {
      title: "Save PRD",
      description:
        "Draft_prd jaisa hi PRD banata hai, lekin isse app mein save (DB) bhi kar deta hai taaki web pe dikhe. apiKey chahiye — user /account page se apna MCP API key generate karke de sakta hai.",
      inputSchema: z.object({
        apiKey: z.string(),
        category: z.string(),
        title: z.string().min(1),
        author: z.string().optional(),
        sections: z.record(z.string(), z.string()),
      }),
    },
    async ({ apiKey, category, title, author, sections }) => {
      const userId = await getUserIdForApiKey(apiKey);
      if (!userId) {
        return {
          content: [{ type: "text", text: "Invalid API key. /account page se apna key check karo." }],
          isError: true,
        };
      }

      const template = await getAnyTemplate(category);
      if (!template) {
        return { content: [{ type: "text", text: `Unknown category: ${category}` }], isError: true };
      }

      const result = validateAndBuild(template, sections, { title, author });
      if ("error" in result) {
        return { content: [{ type: "text", text: result.error }], isError: true };
      }

      const id = await createPrd({
        categoryId: category,
        title,
        author,
        sections,
        markdown: result.markdown,
        createdBy: userId,
      });

      const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
      return {
        content: [{ type: "text", text: `Saved. ${baseUrl}/prds/${id}` }],
      };
    },
  );
});

export { handler as GET, handler as POST };
