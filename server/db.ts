import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export let db: any = null;
export let pool: Pool | null = null;
export let isDatabaseAvailable = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    isDatabaseAvailable = true;
    console.log("✅ Database connection configured");
  } catch (error) {
    console.warn("⚠️  Database connection failed:", error);
    isDatabaseAvailable = false;
  }
} else {
  console.warn("⚠️  DATABASE_URL not set. Running in memory-only mode for development.");
  console.warn("   For full database functionality, set DATABASE_URL environment variable.");
  isDatabaseAvailable = false;
}
