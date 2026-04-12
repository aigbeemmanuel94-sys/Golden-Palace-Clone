import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id"),
  categoryName: text("category_name"),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  badge: text("badge"),
  weight: text("weight"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
