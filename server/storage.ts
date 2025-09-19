import { type Bin, type InsertBin, type BinReading, type InsertBinReading, type SimulationConfig } from "@shared/schema";
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

export class MemStorage implements IStorage {
  private bins: Map<string, Bin>;
  private readings: Map<string, BinReading[]>;
  private simulationConfig: SimulationConfig;

  constructor() {
    this.bins = new Map();
    this.readings = new Map();
    this.simulationConfig = {
      pattern: "random",
      updateInterval: 10,
      alertThreshold: 90,
      isRunning: false,
    };
    
    // Initialize with a default bin
    this.createDefaultBin();
  }

  private async createDefaultBin() {
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

  async getBin(id: string): Promise<Bin | undefined> {
    return this.bins.get(id);
  }

  async getAllBins(): Promise<Bin[]> {
    return Array.from(this.bins.values());
  }

  async createBin(insertBin: InsertBin): Promise<Bin> {
    const id = randomUUID();
    const now = new Date();
    const bin: Bin = {
      id,
      name: insertBin.name,
      location: insertBin.location,
      fillLevel: insertBin.fillLevel ?? 0,
      status: insertBin.status ?? "normal",
      alertThreshold: insertBin.alertThreshold ?? 90,
      isActive: insertBin.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    
    this.bins.set(id, bin);
    this.readings.set(id, []);
    return bin;
  }

  async updateBin(id: string, updates: Partial<Bin>): Promise<Bin | undefined> {
    const bin = this.bins.get(id);
    if (!bin) return undefined;
    
    const updatedBin: Bin = {
      ...bin,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.bins.set(id, updatedBin);
    return updatedBin;
  }

  async addReading(insertReading: InsertBinReading): Promise<BinReading> {
    const id = randomUUID();
    const reading: BinReading = {
      ...insertReading,
      id,
      timestamp: new Date(),
    };
    
    const readings = this.readings.get(insertReading.binId) || [];
    readings.push(reading);
    
    // Keep only last 50 readings per bin
    if (readings.length > 50) {
      readings.shift();
    }
    
    this.readings.set(insertReading.binId, readings);
    return reading;
  }

  async getBinReadings(binId: string, limit = 20): Promise<BinReading[]> {
    const readings = this.readings.get(binId) || [];
    return readings.slice(-limit);
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

export const storage = new MemStorage();
