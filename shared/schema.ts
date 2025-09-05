import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scanHistory = pgTable("scan_history", {
  id: varchar("id").primaryKey(),
  mode: text("mode").notNull(),
  missingItems: text("missing_items").array().notNull().default([]),
  allItemsDetected: boolean("all_items_detected").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertScanHistorySchema = createInsertSchema(scanHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;
export type ScanHistory = typeof scanHistory.$inferSelect;

// FastAPI compatible schemas
export const fastApiItemStatusSchema = z.object({
  name: z.string(),
  status: z.enum(["detected", "missing"]),
});

export const fastApiScanResponseSchema = z.object({
  mode: z.string(),
  items: z.array(fastApiItemStatusSchema),
});

export const fastApiHistoryItemSchema = z.object({
  id: z.number(),
  item_name: z.string(),
  mode: z.string(),
  timestamp: z.string(),
  status: z.string(),
});

// Legacy schemas for backward compatibility
export const itemStatusSchema = z.object({
  name: z.string(),
  detected: z.boolean(),
});

export const scanRequestSchema = z.object({
  mode: z.string(),
});

export const scanResponseSchema = z.object({
  items: z.array(itemStatusSchema),
  allDetected: z.boolean(),
  missingItems: z.array(z.string()),
});

export type FastApiItemStatus = z.infer<typeof fastApiItemStatusSchema>;
export type FastApiScanResponse = z.infer<typeof fastApiScanResponseSchema>;
export type FastApiHistoryItem = z.infer<typeof fastApiHistoryItemSchema>;

export type ItemStatus = z.infer<typeof itemStatusSchema>;
export type ScanRequest = z.infer<typeof scanRequestSchema>;
export type ScanResponse = z.infer<typeof scanResponseSchema>;
