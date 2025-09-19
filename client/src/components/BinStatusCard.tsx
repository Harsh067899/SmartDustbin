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

  // Calculate gauge progress with smooth animation
  const circumference = 2 * Math.PI * 80; // radius = 80
  const progress = (bin.fillLevel / 100) * circumference;
  
  // Generate particle effects for active filling
  const generateParticles = () => {
    const particles = [];
    if (bin.fillLevel > 0) {
      for (let i = 0; i < Math.min(5, Math.floor(bin.fillLevel / 10)); i++) {
        particles.push(
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              bin.status === 'alert' ? 'bg-destructive' :
              bin.status === 'warning' ? 'bg-orange-500' : 'bg-chart-1'
            } opacity-60 animate-bounce`}
            style={{
              left: `${45 + (i * 10)}%`,
              top: `${20 + (i * 5)}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: '1.5s',
            }}
          />
        );
      }
    }
    return particles;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bin Status</h3>
        {getStatusBadge()}
      </div>
      
      {/* Enhanced Gauge Meter with Animations */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Animated background pulse for alerts */}
        {bin.status === 'alert' && (
          <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse" />
        )}
        
        {/* Main gauge container */}
        <div className="relative w-full h-full">
          <svg width="192" height="192" className="transform -rotate-90">
            {/* Background circle */}
            <circle 
              cx="96" 
              cy="96" 
              r="80" 
              stroke="hsl(var(--muted))" 
              strokeWidth="12" 
              fill="none" 
            />
            
            {/* Animated progress circle with liquid effect */}
            <circle 
              cx="96" 
              cy="96" 
              r="80" 
              className={`${getGaugeColor()} transition-all duration-[2000ms] ease-out`}
              strokeWidth="12" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              strokeDashoffset="0"
              style={{
                filter: bin.fillLevel > 0 ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                opacity: bin.fillLevel > 0 ? '1' : '0.3',
              }}
              data-testid="gauge-progress"
            />
            
            {/* Secondary glow effect for high levels */}
            {bin.fillLevel > 70 && (
              <circle 
                cx="96" 
                cy="96" 
                r="80" 
                className={`${getGaugeColor()} animate-pulse`}
                strokeWidth="4" 
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${circumference}`}
                strokeDashoffset="0"
                style={{ opacity: '0.4' }}
              />
            )}
          </svg>
          
          {/* Floating particles for active simulation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {generateParticles()}
          </div>
          
          {/* Central content with enhanced styling */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span 
                className={`text-3xl font-bold transition-all duration-500 ${
                  bin.status === 'alert' ? 'text-destructive animate-pulse' :
                  bin.status === 'warning' ? 'text-orange-500' : 'text-foreground'
                }`}
                data-testid="fill-percentage"
              >
                {Math.round(bin.fillLevel)}%
              </span>
              <div className="text-sm text-muted-foreground">Fill Level</div>
              
              {/* Status indicator */}
              <div className={`mt-1 text-xs font-medium transition-all duration-300 ${
                bin.status === 'alert' ? 'text-destructive' :
                bin.status === 'warning' ? 'text-orange-500' : 'text-green-600'
              }`}>
                {bin.status === 'alert' ? 'FULL!' :
                 bin.status === 'warning' ? 'Almost Full' : 'Normal'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar with Liquid Animation */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Capacity</span>
          <span className="text-foreground font-medium" data-testid="progress-percentage">
            {Math.round(bin.fillLevel)}%
          </span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-4 overflow-hidden">
          {/* Main progress bar with liquid wave effect */}
          <div 
            className={`${getProgressBarColor()} h-full rounded-full transition-all duration-[2000ms] ease-out relative overflow-hidden`}
            style={{ width: `${Math.min(100, bin.fillLevel)}%` }}
            data-testid="progress-bar"
          >
            {/* Liquid wave animation */}
            {bin.fillLevel > 0 && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                  animation: 'wave 3s linear infinite',
                  transform: 'translateX(-100%)',
                }}
              />
            )}
            
            {/* Bubbles for active simulation */}
            {bin.fillLevel > 10 && (
              <>
                <div 
                  className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
                  style={{
                    left: '20%',
                    top: '30%',
                    animationDuration: '1.8s',
                    animationDelay: '0.5s',
                  }}
                />
                <div 
                  className="absolute w-0.5 h-0.5 bg-white/60 rounded-full animate-bounce"
                  style={{
                    left: '60%',
                    top: '20%',
                    animationDuration: '2.2s',
                    animationDelay: '1s',
                  }}
                />
                <div 
                  className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce"
                  style={{
                    left: '80%',
                    top: '40%',
                    animationDuration: '1.5s',
                    animationDelay: '0.2s',
                  }}
                />
              </>
            )}
          </div>
          
          {/* Alert pulsing overlay */}
          {bin.status === 'alert' && (
            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse" />
          )}
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
