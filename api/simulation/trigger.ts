import { storage } from '../../server/storage';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const config = await storage.getSimulationConfig();
    if (!config.isRunning) {
      return res.json({ message: 'Simulation is not running', updated: false });
    }

    const bins = await storage.getAllBins();
    let updated = false;
    
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
      
      updated = true;
      
      // Stop simulation if bin is full
      if (newFillLevel >= 100) {
        await storage.updateSimulationConfig({ isRunning: false });
        break;
      }
    }
    
    res.json({ message: 'Simulation updated', updated, config });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update simulation' });
  }
}