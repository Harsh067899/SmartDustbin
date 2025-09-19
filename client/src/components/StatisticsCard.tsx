import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, AlertTriangle, Clock } from 'lucide-react';
import { type BinReading } from '@shared/schema';

interface StatisticsCardProps {
  binId: string;
}

export default function StatisticsCard({ binId }: StatisticsCardProps) {
  const [timeToFull, setTimeToFull] = useState<string>('Calculating...');

  const { data: readings = [] } = useQuery<BinReading[]>({
    queryKey: ['/api/bins', binId, 'readings'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (readings.length >= 3) {
      const recent = readings.slice(-5); // Use last 5 readings for better accuracy
      if (recent.length >= 2) {
        const firstReading = recent[0];
        const lastReading = recent[recent.length - 1];
        
        const timeDiff = (new Date(lastReading.timestamp).getTime() - new Date(firstReading.timestamp).getTime()) / 1000; // seconds
        const fillDiff = lastReading.fillLevel - firstReading.fillLevel;
        
        if (fillDiff > 0 && timeDiff > 0) {
          const fillRate = fillDiff / timeDiff; // % per second
          const remainingFill = 100 - lastReading.fillLevel;
          const timeToFullSeconds = remainingFill / fillRate;
          
          if (timeToFullSeconds < 3600) { // Less than 1 hour
            setTimeToFull(Math.round(timeToFullSeconds / 60) + ' min');
          } else if (timeToFullSeconds < 86400) { // Less than 1 day
            setTimeToFull(Math.round(timeToFullSeconds / 3600) + ' hrs');
          } else {
            setTimeToFull(Math.round(timeToFullSeconds / 86400) + ' days');
          }
        } else {
          setTimeToFull('Stable');
        }
      }
    } else {
      setTimeToFull('Calculating...');
    }
  }, [readings]);

  const calculateStats = () => {
    if (readings.length === 0) {
      return {
        avgFillRate: 0,
        totalUpdates: 0,
        maxFillLevel: 0,
        alertCount: 0,
      };
    }

    const totalUpdates = readings.length;
    const maxFillLevel = Math.max(...readings.map(r => r.fillLevel));
    const alertCount = readings.filter(r => r.status === 'alert').length;
    
    let avgFillRate = 0;
    if (readings.length >= 2) {
      const firstReading = readings[0];
      const lastReading = readings[readings.length - 1];
      const timeDiff = (new Date(lastReading.timestamp).getTime() - new Date(firstReading.timestamp).getTime()) / (1000 * 60 * 60); // hours
      const fillDiff = lastReading.fillLevel - firstReading.fillLevel;
      avgFillRate = timeDiff > 0 ? fillDiff / timeDiff : 0;
    }

    return {
      avgFillRate: Math.round(avgFillRate * 10) / 10,
      totalUpdates,
      maxFillLevel: Math.round(maxFillLevel),
      alertCount,
    };
  };

  const stats = calculateStats();

  const statItems = [
    {
      title: 'Time to Full',
      value: timeToFull,
      description: 'Estimated based on current rate',
      icon: Clock,
      color: 'text-chart-1',
      testId: 'time-to-full'
    },
    {
      title: 'Avg Fill Rate',
      value: stats.avgFillRate > 0 ? `${stats.avgFillRate}%/hr` : '--',
      description: 'Rate of fill increase',
      icon: TrendingUp,
      color: 'text-chart-2',
      testId: 'avg-fill-rate'
    },
    {
      title: 'Data Points',
      value: stats.totalUpdates.toString(),
      description: 'Total readings collected',
      icon: Database,
      color: 'text-chart-3',
      testId: 'total-updates'
    },
    {
      title: 'Peak Level',
      value: `${stats.maxFillLevel}%`,
      description: 'Highest fill level reached',
      icon: AlertTriangle,
      color: 'text-chart-4',
      testId: 'max-fill-level'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics & Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => (
            <div 
              key={item.title}
              className="text-center p-4 bg-muted/30 rounded-lg"
              data-testid={item.testId}
            >
              <div className="flex items-center justify-center mb-2">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {stats.alertCount > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {stats.alertCount} alert{stats.alertCount !== 1 ? 's' : ''} triggered
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monitor fill levels to reduce alert frequency.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
