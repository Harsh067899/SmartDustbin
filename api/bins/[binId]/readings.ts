import { storage } from '../../../server/storage';
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

  const { binId } = req.query;

  if (req.method === 'GET') {
    try {
      if (!binId || Array.isArray(binId)) {
        return res.status(400).json({ message: 'Invalid bin ID' });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const readings = await storage.getBinReadings(binId, limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch readings' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}