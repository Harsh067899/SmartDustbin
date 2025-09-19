import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { type SimulationConfig } from '@shared/schema';

interface SimulationControlsProps {
  isRunning: boolean;
}

export default function SimulationControls({ isRunning }: SimulationControlsProps) {
  const { toast } = useToast();
  const [alertThreshold, setAlertThreshold] = useState('90');
  const [updateInterval, setUpdateInterval] = useState('10');
  const [pattern, setPattern] = useState('random');

  const { data: config } = useQuery<SimulationConfig>({
    queryKey: ['/api/simulation/config'],
  });

  // Sync local state with config
  useEffect(() => {
    if (config) {
      setAlertThreshold(config.alertThreshold.toString());
      setUpdateInterval(config.updateInterval.toString());
      setPattern(config.pattern);
    }
  }, [config]);

  const startMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/simulation/start'),
    onSuccess: () => {
      toast({
        title: 'Simulation Started',
        description: 'The dustbin simulation is now running.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/simulation/config'] });
    },
    onError: () => {
      toast({
        title: 'Failed to Start',
        description: 'Could not start the simulation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/simulation/stop'),
    onSuccess: () => {
      toast({
        title: 'Simulation Stopped',
        description: 'The dustbin simulation has been stopped.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/simulation/config'] });
    },
    onError: () => {
      toast({
        title: 'Failed to Stop',
        description: 'Could not stop the simulation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/simulation/reset'),
    onSuccess: () => {
      toast({
        title: 'Simulation Reset',
        description: 'All bins have been reset to 0% fill level.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bins'] });
      queryClient.invalidateQueries({ queryKey: ['/api/simulation/config'] });
    },
    onError: () => {
      toast({
        title: 'Failed to Reset',
        description: 'Could not reset the simulation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const configMutation = useMutation({
    mutationFn: (updates: Partial<SimulationConfig>) => 
      apiRequest('PATCH', '/api/simulation/config', updates),
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Simulation settings have been saved.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/simulation/config'] });
    },
    onError: () => {
      toast({
        title: 'Failed to Update',
        description: 'Could not update simulation settings.',
        variant: 'destructive',
      });
    },
  });

  const handleConfigChange = (updates: Partial<SimulationConfig>) => {
    configMutation.mutate(updates);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Simulation Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button
            onClick={() => startMutation.mutate()}
            disabled={isRunning || startMutation.isPending}
            className="min-w-[140px]"
            data-testid="start-simulation"
          >
            <Play className="w-4 h-4 mr-2" />
            {startMutation.isPending ? 'Starting...' : 'Start Simulation'}
          </Button>

          <Button
            onClick={() => stopMutation.mutate()}
            disabled={!isRunning || stopMutation.isPending}
            variant="secondary"
            className="min-w-[120px]"
            data-testid="stop-simulation"
          >
            <Pause className="w-4 h-4 mr-2" />
            {stopMutation.isPending ? 'Stopping...' : 'Stop'}
          </Button>

          <Button
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            variant="outline"
            className="min-w-[120px]"
            data-testid="reset-simulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {resetMutation.isPending ? 'Resetting...' : 'Reset'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="alertThreshold">Alert Threshold</Label>
            <Select
              value={alertThreshold}
              onValueChange={(value) => {
                setAlertThreshold(value);
                handleConfigChange({ alertThreshold: parseInt(value) });
              }}
            >
              <SelectTrigger data-testid="alert-threshold-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="70">70%</SelectItem>
                <SelectItem value="80">80%</SelectItem>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateInterval">Update Interval</Label>
            <Select
              value={updateInterval}
              onValueChange={(value) => {
                setUpdateInterval(value);
                handleConfigChange({ updateInterval: parseInt(value) });
              }}
            >
              <SelectTrigger data-testid="update-interval-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern">Data Pattern</Label>
            <Select
              value={pattern}
              onValueChange={(value) => {
                setPattern(value);
                handleConfigChange({ pattern: value as 'random' | 'linear' | 'realistic' });
              }}
            >
              <SelectTrigger data-testid="data-pattern-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random Growth</SelectItem>
                <SelectItem value="linear">Linear Growth</SelectItem>
                <SelectItem value="realistic">Realistic Usage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
