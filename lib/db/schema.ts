// Better Auth ka core schema (hand-written, CLI generate nahi use kiya) + app tables.
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// --- Better Auth core tables ---

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// --- App tables ---

// User-added custom PRD templates (built-in templates lib/templates.ts mein hardcoded rehte hain).
export const customTemplate = sqliteTable("custom_template", {
  id: text("id").primaryKey(), // slug, e.g. "incident-postmortem"
  label: text("label").notNull(),
  description: text("description").notNull(),
  sectionsJson: text("sections_json").notNull(), // PrdSection[] JSON
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Saved/exported PRDs — team-shared, har user dekh sakta hai.
export const prd = sqliteTable("prd", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(), // built-in ya custom template id
  title: text("title").notNull(),
  author: text("author"),
  sectionsJson: text("sections_json").notNull(), // Record<string, string> JSON
  markdown: text("markdown").notNull(), // rendered output, cached
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
