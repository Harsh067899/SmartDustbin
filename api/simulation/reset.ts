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
    // Stop simulation
    await storage.updateSimulationConfig({ isRunning: false });
    
    // Reset all bins to 0
    const bins = await storage.getAllBins();
    for (const bin of bins) {
      await storage.updateBin(bin.id, {
        fillLevel: 0,
        status: "normal"
      });
    }
    
    const config = await storage.getSimulationConfig();
    res.json({ message: 'Simulation reset', config });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset simulation' });
  }
}