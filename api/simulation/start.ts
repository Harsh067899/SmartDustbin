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
    const config = await storage.updateSimulationConfig({ isRunning: true });
    // Note: In serverless, we can't maintain long-running intervals
    // The simulation would need to be triggered by periodic requests or cron jobs
    res.json({ message: 'Simulation started', config });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start simulation' });
  }
}