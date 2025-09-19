import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { type BinReading } from '@shared/schema';

interface HistoricalChartProps {
  binId: string;
}

export default function HistoricalChart({ binId }: HistoricalChartProps) {
  const { data: readings = [], isLoading } = useQuery<BinReading[]>({
    queryKey: ['/api/bins', binId, 'readings'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Fill Level History</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const chartData = readings.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    fillLevel: Math.round(reading.fillLevel * 10) / 10,
    status: reading.status,
  }));

  const getLineColor = () => {
    if (readings.length === 0) return '#3b82f6';
    const latestReading = readings[readings.length - 1];
    switch (latestReading.status) {
      case 'alert':
        return '#ef4444';
      case 'warning':
        return '#f97316';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Fill Level History</h3>
        <div className="text-sm text-muted-foreground">
          {readings.length > 0 ? `Last ${readings.length} readings` : 'No data yet'}
        </div>
      </div>
      
      <div className="h-80" data-testid="history-chart">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [`${value}%`, 'Fill Level']}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="fillLevel"
                stroke={getLineColor()}
                strokeWidth={2}
                dot={{ fill: getLineColor(), strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">No historical data available</p>
              <p className="text-sm">Start the simulation to begin collecting data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
