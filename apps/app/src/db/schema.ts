/**
 * [ONEWEEKBRIEF_SCHEMA] Drizzle ORM schema for the customer-facing surface.
 *
 * Tables: users, briefs, deliveries, orders, events, monitors.
 * Matches the data model in docs/12-technical-specification.md §2.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  // [ONEWEEKBRIEF_SCHEMA_DRIFT_2026-06-02] `password_hash` is present in the
  // live `users` table (inherited from the open-saas scaffold bootstrap in
  // apps/app/README.md) but is NOT used by the customer-facing brief flow
  // (auth is via Postmark magic-link, not password). The column is nullable
  // in production; the brief insert below writes an empty string so the
  // NOT NULL constraint is satisfied without pretending we have a password.
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const briefs = pgTable("briefs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  scopeMd: text("scope_md").notNull(),
  tier: text("tier").notNull(), // one_off | pro | monitor
  status: text("status").notNull().default("submitted"), // submitted | clarifying | in_progress | editor_review | delivered | cancelled | refunded
  slaHours: integer("sla_hours").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true })
}, (table) => [
  index("briefs_status_idx").on(table.status),
  index("briefs_submitted_at_idx").on(table.submittedAt)
]);

export const deliveries = pgTable("deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id").references(() => briefs.id).notNull().unique(),
  artifactUrl: text("artifact_url"),
  sources: jsonb("sources").$type<Array<{ citeId: string; title: string; url: string; accessedAt: string }>>(),
  editorName: text("editor_name"),
  editorSignoffNote: text("editor_signoff_note"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true })
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id").references(() => briefs.id).notNull(),
  invoiceId: text("invoice_id").notNull().unique(),
  amountCents: integer("amount_cents").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true })
}, (table) => [
  uniqueIndex("orders_invoice_id_idx").on(table.invoiceId)
]);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id").references(() => briefs.id).notNull(),
  type: text("type").notNull(), // submitted | clarification_requested | engine_started | editor_review | delivered | refunded
  payload: jsonb("payload"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow()
});

export const monitors = pgTable("monitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  baseBriefId: uuid("base_brief_id").references(() => briefs.id).notNull(),
  cadenceDays: integer("cadence_days").notNull().default(14),
  nextRunAt: timestamp("next_run_at", { withTimezone: true })
}, (table) => [
  index("monitors_next_run_at_idx").on(table.nextRunAt)
]);

/* Relations */

export const usersRelations = relations(users, ({ many }) => ({
  briefs: many(briefs),
  monitors: many(monitors)
}));

export const briefsRelations = relations(briefs, ({ one, many }) => ({
  user: one(users, { fields: [briefs.userId], references: [users.id] }),
  delivery: one(deliveries),
  orders: many(orders),
  events: many(events),
  monitors: many(monitors)
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  brief: one(briefs, { fields: [deliveries.briefId], references: [briefs.id] })
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  brief: one(briefs, { fields: [orders.briefId], references: [briefs.id] })
}));

export const eventsRelations = relations(events, ({ one }) => ({
  brief: one(briefs, { fields: [events.briefId], references: [briefs.id] })
}));

export const monitorsRelations = relations(monitors, ({ one }) => ({
  user: one(users, { fields: [monitors.userId], references: [users.id] }),
  baseBrief: one(briefs, { fields: [monitors.baseBriefId], references: [briefs.id] })
}));
