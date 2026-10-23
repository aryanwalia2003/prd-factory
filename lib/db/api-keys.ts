import { randomUUID, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { apiKey } from "./schema";

export async function getApiKeyForUser(userId: string): Promise<string | undefined> {
  const [row] = await db.select().from(apiKey).where(eq(apiKey.userId, userId));
  return row?.token;
}

// Regenerate = purani key delete, nayi daal do (ek hi active key per user).
export async function generateApiKeyForUser(userId: string): Promise<string> {
  const token = `prd_${randomBytes(24).toString("hex")}`;
  await db.delete(apiKey).where(eq(apiKey.userId, userId));
  await db.insert(apiKey).values({ id: randomUUID(), userId, token, createdAt: new Date() });
  return token;
}

export async function getUserIdForApiKey(token: string): Promise<string | undefined> {
  const [row] = await db.select().from(apiKey).where(eq(apiKey.token, token));
  return row?.userId;
}
