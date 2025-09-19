import { storage } from '../../server/storage';
import { simulationConfigSchema } from '../../shared/schema';
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

  if (req.method === 'GET') {
    try {
      const config = await storage.getSimulationConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch simulation config' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const validatedConfig = simulationConfigSchema.partial().parse(req.body);
      const config = await storage.updateSimulationConfig(validatedConfig);
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: 'Invalid configuration' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}