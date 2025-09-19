import { useEffect, useState, useCallback, useRef } from 'react';
import { type WSMessage } from '@shared/schema';

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WSMessage | null;
  sendMessage: (message: any) => void;
  reconnect: () => void;
}

// For serverless deployment, we simulate WebSocket with polling
export function useWebSocket(_url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(true); // Always "connected" in polling mode
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<any>(null);

  const pollForUpdates = useCallback(async () => {
    try {
      // Poll simulation config for status changes
      const configRes = await fetch('/api/simulation/config');
      if (configRes.ok) {
        const config = await configRes.json();
        
        // If simulation is running, trigger an update
        if (config.isRunning) {
          fetch('/api/simulation/trigger', { method: 'POST' }).catch(console.error);
        }
        
        // Check if simulation status changed
        if (lastDataRef.current?.simulationConfig?.isRunning !== config.isRunning) {
          setLastMessage({
            type: "simulationStatus",
            data: { isRunning: config.isRunning, config }
          });
        }
        
        if (!lastDataRef.current) lastDataRef.current = {};
        lastDataRef.current.simulationConfig = config;
      }

      // Poll bins for updates
      const binsRes = await fetch('/api/bins');
      if (binsRes.ok) {
        const bins = await binsRes.json();
        
        // Check for bin updates
        if (lastDataRef.current?.bins) {
          for (const bin of bins) {
            const oldBin = lastDataRef.current.bins.find((b: any) => b.id === bin.id);
            if (!oldBin || oldBin.fillLevel !== bin.fillLevel || oldBin.status !== bin.status) {
              setLastMessage({
                type: "binUpdate",
                data: {
                  binId: bin.id,
                  fillLevel: bin.fillLevel,
                  status: bin.status,
                  timestamp: new Date().toISOString(),
                }
              });

              // Check for alerts
              if (oldBin && bin.fillLevel >= 80 && oldBin.fillLevel < 80) {
                setLastMessage({
                  type: "alert",
                  data: {
                    binId: bin.id,
                    message: `Dustbin ${bin.name} is ${Math.round(bin.fillLevel)}% full and requires attention!`,
                    severity: bin.fillLevel >= 100 ? "alert" : "warning"
                  }
                });
              }
            }
          }
        }
        
        lastDataRef.current.bins = bins;
      }
    } catch (error) {
      console.error('Polling error:', error);
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    // In polling mode, we don't send messages through WebSocket
    // API calls are made directly from components
    console.log('Message sending not supported in polling mode:', message);
  }, []);

  const reconnect = useCallback(() => {
    setIsConnected(true);
    pollForUpdates();
  }, [pollForUpdates]);

  useEffect(() => {
    // Start polling every 2 seconds
    pollingIntervalRef.current = setInterval(pollForUpdates, 2000);
    
    // Initial poll
    pollForUpdates();
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [pollForUpdates]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    reconnect,
  };
}