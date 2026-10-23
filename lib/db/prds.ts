import { randomUUID } from "node:crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "./index";
import { prd, user } from "./schema";

function toPrd(row: typeof prd.$inferSelect, creatorEmail?: string | null) {
  return {
    id: row.id,
    categoryId: row.categoryId,
    title: row.title,
    author: row.author,
    sections: JSON.parse(row.sectionsJson) as Record<string, string>,
    markdown: row.markdown,
    createdBy: row.createdBy,
    createdByEmail: creatorEmail ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listPrds() {
  const rows = await db
    .select({ prd, creatorEmail: user.email })
    .from(prd)
    .leftJoin(user, eq(prd.createdBy, user.id))
    .orderBy(desc(prd.createdAt));
  return rows.map((r) => toPrd(r.prd, r.creatorEmail));
}

export async function getPrd(id: string) {
  const [row] = await db.select().from(prd).where(eq(prd.id, id));
  return row ? toPrd(row) : undefined;
}

export async function createPrd(input: {
  categoryId: string;
  title: string;
  author?: string;
  sections: Record<string, string>;
  markdown: string;
  createdBy: string;
}) {
  const now = new Date();
  const id = randomUUID();
  await db.insert(prd).values({
    id,
    categoryId: input.categoryId,
    title: input.title,
    author: input.author,
    sectionsJson: JSON.stringify(input.sections),
    markdown: input.markdown,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function deletePrd(id: string, userId: string) {
  const [row] = await db.select().from(prd).where(eq(prd.id, id));
  if (!row || row.createdBy !== userId) return false;
  await db.delete(prd).where(eq(prd.id, id));
  return true;
}
