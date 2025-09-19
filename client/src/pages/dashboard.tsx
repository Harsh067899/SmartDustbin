import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/useWebSocket';
import { type Bin, type WSMessage } from '@shared/schema';
import BinStatusCard from '../components/BinStatusCard';
import HistoricalChart from '../components/HistoricalChart';
import SimulationControls from '../components/SimulationControls';
import StatisticsCard from '../components/StatisticsCard';
import AlertBanner from '../components/AlertBanner';
import AnimatedDustbin from '../components/AnimatedDustbin';
import { Trash2, Activity } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
  const [currentBin, setCurrentBin] = useState<Bin | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'warning' | 'alert'>('warning');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  const { data: bins = [] } = useQuery<Bin[]>({
    queryKey: ['/api/bins'],
  });

  const { isConnected, lastMessage } = useWebSocket(
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}://${window.location.host}/ws`
  );

  // Set the first bin as current bin when bins are loaded
  useEffect(() => {
    if (bins.length > 0 && !currentBin) {
      setCurrentBin(bins[0]);
    }
  }, [bins, currentBin]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'binUpdate':
        if (currentBin && lastMessage.data.binId === currentBin.id) {
          setCurrentBin(prev => prev ? {
            ...prev,
            fillLevel: lastMessage.data.fillLevel,
            status: lastMessage.data.status,
          } : null);
        }
        break;
        
      case 'simulationStatus':
        setIsSimulationRunning(lastMessage.data.isRunning);
        break;
        
      case 'alert':
        if (currentBin && lastMessage.data.binId === currentBin.id) {
          setAlertMessage(lastMessage.data.message);
          setAlertSeverity(lastMessage.data.severity);
        }
        break;
    }
  }, [lastMessage, currentBin]);

  const dismissAlert = () => {
    setAlertMessage(null);
  };

  if (!currentBin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Smart Dustbin Monitor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {isSimulationRunning ? 'Live Simulation' : 'Simulation Stopped'}
              </span>
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {alertMessage && (
        <AlertBanner 
          message={alertMessage} 
          severity={alertSeverity}
          onDismiss={dismissAlert}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simulation Controls */}
        <SimulationControls isRunning={isSimulationRunning} />

        {/* Animated Dustbin Section */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-12 border border-border shadow-lg overflow-visible">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
            🗑️ Real-time Dustbin Monitor
          </h2>
          <div className="flex justify-center items-center min-h-[600px] w-full overflow-visible px-8">
            <AnimatedDustbin bin={currentBin} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bin Status Card */}
          <div className="lg:col-span-1">
            <BinStatusCard bin={currentBin} />
          </div>

          {/* Historical Chart */}
          <div className="lg:col-span-2">
            <HistoricalChart binId={currentBin.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statistics */}
          <StatisticsCard binId={currentBin.id} />

          {/* Multiple Bins Preview */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Multiple Bins Overview</h3>
            <div className="space-y-3">
              {bins.map((bin, index) => (
                <div 
                  key={bin.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentBin.id === bin.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentBin(bin)}
                  data-testid={`bin-card-${bin.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-chart-1' :
                      index === 1 ? 'bg-chart-2' :
                      index === 2 ? 'bg-chart-3' : 'bg-chart-4'
                    }`}>
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{bin.name}</div>
                      <div className="text-xs text-muted-foreground">{bin.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          bin.status === 'alert' ? 'bg-destructive' :
                          bin.status === 'warning' ? 'bg-orange-500' : 'bg-chart-1'
                        }`}
                        style={{ width: `${Math.min(100, bin.fillLevel)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">
                      {Math.round(bin.fillLevel)}%
                    </span>
                  </div>
                </div>
              ))}
              
              {bins.length === 1 && (
                <>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Kitchen Area</div>
                        <div className="text-xs text-muted-foreground">BIN-002</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-chart-2 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8">45%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Conference Room</div>
                        <div className="text-xs text-muted-foreground">BIN-003</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-chart-3 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8">78%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2 text-accent">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Feature</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Multiple bin monitoring will be available in Phase 3 of development.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
