import { type Bin, type InsertBin, type BinReading, type InsertBinReading, type SimulationConfig, bins, binReadings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Bin operations
  getBin(id: string): Promise<Bin | undefined>;
  getAllBins(): Promise<Bin[]>;
  createBin(bin: InsertBin): Promise<Bin>;
  updateBin(id: string, updates: Partial<Bin>): Promise<Bin | undefined>;
  
  // Reading operations
  addReading(reading: InsertBinReading): Promise<BinReading>;
  getBinReadings(binId: string, limit?: number): Promise<BinReading[]>;
  
  // Simulation operations
  getSimulationConfig(): Promise<SimulationConfig>;
  updateSimulationConfig(config: Partial<SimulationConfig>): Promise<SimulationConfig>;
}

export class DatabaseStorage implements IStorage {
  private simulationConfig: SimulationConfig;

  constructor() {
    this.simulationConfig = {
      pattern: "random",
      updateInterval: 10,
      alertThreshold: 90,
      isRunning: false,
    };
    
    // Initialize with a default bin if none exist
    this.initializeDefaultBin();
  }

  private async initializeDefaultBin() {
    try {
      const existingBins = await this.getAllBins();
      if (existingBins.length === 0) {
        const defaultBin: InsertBin = {
          name: "Main Lobby",
          location: "Building A - Ground Floor",
          fillLevel: 0,
          status: "normal",
          alertThreshold: 90,
          isActive: true,
        };
        await this.createBin(defaultBin);
      }
    } catch (error) {
      console.error("Failed to initialize default bin:", error);
    }
  }

  async getBin(id: string): Promise<Bin | undefined> {
    try {
      const [bin] = await db.select().from(bins).where(eq(bins.id, id));
      return bin || undefined;
    } catch (error) {
      console.error("Failed to get bin:", error);
      return undefined;
    }
  }

  async getAllBins(): Promise<Bin[]> {
    try {
      return await db.select().from(bins);
    } catch (error) {
      console.error("Failed to get all bins:", error);
      return [];
    }
  }

  async createBin(insertBin: InsertBin): Promise<Bin> {
    try {
      const [bin] = await db
        .insert(bins)
        .values(insertBin)
        .returning();
      return bin;
    } catch (error) {
      console.error("Failed to create bin:", error);
      throw error;
    }
  }

  async updateBin(id: string, updates: Partial<Bin>): Promise<Bin | undefined> {
    try {
      const [bin] = await db
        .update(bins)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(bins.id, id))
        .returning();
      return bin || undefined;
    } catch (error) {
      console.error("Failed to update bin:", error);
      return undefined;
    }
  }

  async addReading(insertReading: InsertBinReading): Promise<BinReading> {
    try {
      const [reading] = await db
        .insert(binReadings)
        .values(insertReading)
        .returning();
      
      // Clean up old readings - keep only last 50 per bin
      const allReadings = await db
        .select()
        .from(binReadings)
        .where(eq(binReadings.binId, insertReading.binId))
        .orderBy(desc(binReadings.timestamp));
      
      if (allReadings.length > 50) {
        const toDelete = allReadings.slice(50);
        for (const oldReading of toDelete) {
          await db.delete(binReadings).where(eq(binReadings.id, oldReading.id));
        }
      }
      
      return reading;
    } catch (error) {
      console.error("Failed to add reading:", error);
      throw error;
    }
  }

  async getBinReadings(binId: string, limit = 20): Promise<BinReading[]> {
    try {
      return await db
        .select()
        .from(binReadings)
        .where(eq(binReadings.binId, binId))
        .orderBy(desc(binReadings.timestamp))
        .limit(limit);
    } catch (error) {
      console.error("Failed to get bin readings:", error);
      return [];
    }
  }

  async getSimulationConfig(): Promise<SimulationConfig> {
    return { ...this.simulationConfig };
  }

  async updateSimulationConfig(config: Partial<SimulationConfig>): Promise<SimulationConfig> {
    this.simulationConfig = {
      ...this.simulationConfig,
      ...config,
    };
    return { ...this.simulationConfig };
  }
}

export const storage = new DatabaseStorage();
