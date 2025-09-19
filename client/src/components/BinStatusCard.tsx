import { useState, useEffect } from 'react';
import { type Bin } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface BinStatusCardProps {
  bin: Bin;
}

export default function BinStatusCard({ bin }: BinStatusCardProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (bin.status) {
      case 'alert':
        return <Badge variant="destructive" data-testid="status-badge">Alert</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500 text-white" data-testid="status-badge">Warning</Badge>;
      default:
        return <Badge className="bg-green-500 text-white" data-testid="status-badge">Normal</Badge>;
    }
  };

  const getGaugeColor = () => {
    switch (bin.status) {
      case 'alert':
        return 'stroke-destructive';
      case 'warning':
        return 'stroke-orange-500';
      default:
        return 'stroke-chart-1';
    }
  };

  const getProgressBarColor = () => {
    switch (bin.status) {
      case 'alert':
        return 'bg-destructive';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-chart-1';
    }
  };

  // Calculate gauge progress
  const circumference = 2 * Math.PI * 80; // radius = 80
  const progress = (bin.fillLevel / 100) * circumference;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bin Status</h3>
        {getStatusBadge()}
      </div>
      
      {/* Gauge Meter */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg width="192" height="192" className="transform -rotate-90">
          <circle 
            cx="96" 
            cy="96" 
            r="80" 
            stroke="hsl(var(--muted))" 
            strokeWidth="12" 
            fill="none" 
          />
          <circle 
            cx="96" 
            cy="96" 
            r="80" 
            className={`${getGaugeColor()} transition-all duration-500`}
            strokeWidth="12" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            strokeDashoffset="0"
            data-testid="gauge-progress"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-3xl font-bold text-foreground" data-testid="fill-percentage">
              {Math.round(bin.fillLevel)}%
            </span>
            <div className="text-sm text-muted-foreground">Fill Level</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Capacity</span>
          <span className="text-foreground font-medium" data-testid="progress-percentage">
            {Math.round(bin.fillLevel)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className={`${getProgressBarColor()} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, bin.fillLevel)}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>

      {/* Status Info */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bin ID:</span>
          <span className="text-foreground font-medium font-mono" data-testid="bin-id">
            {bin.id.substring(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location:</span>
          <span className="text-foreground" data-testid="bin-location">
            {bin.location}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="text-foreground" data-testid="last-updated">
            {lastUpdated}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Alert Threshold:</span>
          <span className="text-foreground font-medium" data-testid="alert-threshold">
            {bin.alertThreshold}%
          </span>
        </div>
      </div>
    </div>
  );
}
