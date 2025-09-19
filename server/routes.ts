import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { simulationConfigSchema, insertBinReadingSchema, type WSMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  let simulationInterval: NodeJS.Timeout | null = null;
  const connectedClients = new Set<WebSocket>();
  
  // WebSocket connection handling
  wss.on('connection', async (ws) => {
    connectedClients.add(ws);
    
    // Send current simulation status to new client
    const config = await storage.getSimulationConfig();
    const bins = await storage.getAllBins();
    
    ws.send(JSON.stringify({
      type: "simulationStatus",
      data: { isRunning: config.isRunning, config }
    }));
    
    // Send current bin data
    for (const bin of bins) {
      ws.send(JSON.stringify({
        type: "binUpdate",
        data: {
          binId: bin.id,
          fillLevel: bin.fillLevel,
          status: bin.status,
          timestamp: new Date().toISOString(),
        }
      }));
    }
    
    ws.on('close', () => {
      connectedClients.delete(ws);
    });
  });
  
  // Broadcast to all connected clients
  function broadcast(message: WSMessage) {
    const messageStr = JSON.stringify(message);
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  // Simulation logic
  async function updateSimulation() {
    const config = await storage.getSimulationConfig();
    if (!config.isRunning) return;
    
    const bins = await storage.getAllBins();
    
    for (const bin of bins) {
      if (!bin.isActive) continue;
      
      let increment = 0;
      
      // Generate increment based on pattern
      switch (config.pattern) {
        case "random":
          increment = Math.floor(Math.random() * 8) + 2; // 2-9%
          break;
        case "linear":
          increment = 2; // Steady 2%
          break;
        case "realistic":
          const baseIncrement = 1.5;
          const variation = (Math.random() - 0.5) * 2; // -1 to +1
          increment = Math.max(0.5, baseIncrement + variation);
          break;
      }
      
      const newFillLevel = Math.min(100, bin.fillLevel + increment);
      let status = "normal";
      
      if (newFillLevel >= config.alertThreshold) {
        status = "alert";
      } else if (newFillLevel >= config.alertThreshold - 10) {
        status = "warning";
      }
      
      // Update bin
      await storage.updateBin(bin.id, {
        fillLevel: newFillLevel,
        status
      });
      
      // Add reading
      await storage.addReading({
        binId: bin.id,
        fillLevel: newFillLevel,
        status
      });
      
      // Broadcast update
      broadcast({
        type: "binUpdate",
        data: {
          binId: bin.id,
          fillLevel: newFillLevel,
          status,
          timestamp: new Date().toISOString(),
        }
      });
      
      // Check for alerts
      if (newFillLevel >= config.alertThreshold && bin.fillLevel < config.alertThreshold) {
        broadcast({
          type: "alert",
          data: {
            binId: bin.id,
            message: `Dustbin ${bin.name} is ${Math.round(newFillLevel)}% full and requires attention!`,
            severity: newFillLevel >= 100 ? "alert" : "warning"
          }
        });
      }
      
      // Stop simulation if bin is full
      if (newFillLevel >= 100) {
        await storage.updateSimulationConfig({ isRunning: false });
        if (simulationInterval) {
          clearInterval(simulationInterval);
          simulationInterval = null;
        }
        
        broadcast({
          type: "simulationStatus",
          data: {
            isRunning: false,
            config: await storage.getSimulationConfig()
          }
        });
        break;
      }
    }
  }
  
  // API Routes
  app.get("/api/bins", async (req, res) => {
    try {
      const bins = await storage.getAllBins();
      res.json(bins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bins" });
    }
  });
  
  app.get("/api/bins/:id", async (req, res) => {
    try {
      const bin = await storage.getBin(req.params.id);
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json(bin);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bin" });
    }
  });
  
  app.get("/api/bins/:id/readings", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const readings = await storage.getBinReadings(req.params.id, limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch readings" });
    }
  });
  
  app.get("/api/simulation/config", async (req, res) => {
    try {
      const config = await storage.getSimulationConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation config" });
    }
  });
  
  app.post("/api/simulation/start", async (req, res) => {
    try {
      const config = await storage.updateSimulationConfig({ isRunning: true });
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      
      simulationInterval = setInterval(updateSimulation, config.updateInterval * 1000);
      
      broadcast({
        type: "simulationStatus",
        data: { isRunning: true, config }
      });
      
      res.json({ message: "Simulation started", config });
    } catch (error) {
      res.status(500).json({ message: "Failed to start simulation" });
    }
  });
  
  app.post("/api/simulation/stop", async (req, res) => {
    try {
      const config = await storage.updateSimulationConfig({ isRunning: false });
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      
      broadcast({
        type: "simulationStatus",
        data: { isRunning: false, config }
      });
      
      res.json({ message: "Simulation stopped", config });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop simulation" });
    }
  });
  
  app.post("/api/simulation/reset", async (req, res) => {
    try {
      // Stop simulation
      await storage.updateSimulationConfig({ isRunning: false });
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      
      // Reset all bins to 0
      const bins = await storage.getAllBins();
      for (const bin of bins) {
        await storage.updateBin(bin.id, {
          fillLevel: 0,
          status: "normal"
        });
      }
      
      const config = await storage.getSimulationConfig();
      
      broadcast({
        type: "simulationStatus",
        data: { isRunning: false, config }
      });
      
      // Broadcast reset bin states
      for (const bin of bins) {
        broadcast({
          type: "binUpdate",
          data: {
            binId: bin.id,
            fillLevel: 0,
            status: "normal",
            timestamp: new Date().toISOString(),
          }
        });
      }
      
      res.json({ message: "Simulation reset", config });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset simulation" });
    }
  });
  
  app.patch("/api/simulation/config", async (req, res) => {
    try {
      const validatedConfig = simulationConfigSchema.partial().parse(req.body);
      const config = await storage.updateSimulationConfig(validatedConfig);
      
      // Restart interval if running and interval changed
      if (config.isRunning && validatedConfig.updateInterval && simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = setInterval(updateSimulation, config.updateInterval * 1000);
      }
      
      broadcast({
        type: "simulationStatus",
        data: { isRunning: config.isRunning, config }
      });
      
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration" });
    }
  });
  
  return httpServer;
}
