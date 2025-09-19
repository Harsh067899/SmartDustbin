import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bins = pgTable("bins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  fillLevel: real("fill_level").notNull().default(0),
  status: text("status").notNull().default("normal"), // "normal", "warning", "alert"
  alertThreshold: integer("alert_threshold").notNull().default(90),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const binReadings = pgTable("bin_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  binId: varchar("bin_id").notNull().references(() => bins.id),
  fillLevel: real("fill_level").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  status: text("status").notNull(),
});

export const insertBinSchema = createInsertSchema(bins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBinReadingSchema = createInsertSchema(binReadings).omit({
  id: true,
  timestamp: true,
});

export const simulationConfigSchema = z.object({
  pattern: z.enum(["random", "linear", "realistic"]).default("random"),
  updateInterval: z.number().min(5).max(60).default(10), // seconds
  alertThreshold: z.number().min(70).max(100).default(90),
  isRunning: z.boolean().default(false),
});

export type InsertBin = z.infer<typeof insertBinSchema>;
export type Bin = typeof bins.$inferSelect;
export type InsertBinReading = z.infer<typeof insertBinReadingSchema>;
export type BinReading = typeof binReadings.$inferSelect;
export type SimulationConfig = z.infer<typeof simulationConfigSchema>;

// WebSocket message types
export const wsMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("binUpdate"),
    data: z.object({
      binId: z.string(),
      fillLevel: z.number(),
      status: z.string(),
      timestamp: z.string(),
    })
  }),
  z.object({
    type: z.literal("simulationStatus"),
    data: z.object({
      isRunning: z.boolean(),
      config: simulationConfigSchema,
    })
  }),
  z.object({
    type: z.literal("alert"),
    data: z.object({
      binId: z.string(),
      message: z.string(),
      severity: z.enum(["warning", "alert"]),
    })
  }),
]);

export type WSMessage = z.infer<typeof wsMessageSchema>;
