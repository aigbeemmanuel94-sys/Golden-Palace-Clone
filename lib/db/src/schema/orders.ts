import { pgTable, text, serial, timestamp, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  guestEmail: text("guest_email"),
  status: text("status").notNull().default("pending"),
  items: jsonb("items").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
