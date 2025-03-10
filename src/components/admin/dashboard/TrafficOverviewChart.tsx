
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, BarChart2 } from 'lucide-react';

interface TrafficData {
  day: string;
  visits: number;
}

interface TrafficOverviewChartProps {
  trafficData?: TrafficData[];
  isLoading?: boolean;
  isError?: boolean;
}

const DEFAULT_TRAFFIC_DATA: TrafficData[] = [
  { day: 'Monday', visits: 145 },
  { day: 'Tuesday', visits: 132 },
  { day: 'Wednesday', visits: 164 },
  { day: 'Thursday', visits: 156 },
  { day: 'Friday', visits: 178 },
  { day: 'Saturday', visits: 210 },
  { day: 'Sunday', visits: 190 },
];

const TrafficOverviewChart: React.FC<TrafficOverviewChartProps> = ({ 
  trafficData = DEFAULT_TRAFFIC_DATA,
  isLoading = false,
  isError = false
}) => {
  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-elvis-pink" />
          Traffic Overview
        </CardTitle>
        <CardDescription>Daily visitor statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
            </div>
          ) : isError ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">Failed to load traffic data</p>
                <p className="text-xs text-white/50 mt-1">Check your analytics connection</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trafficData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className="animate-fade-in"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: 'none', 
                    color: '#fff',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  name="Visitors"
                  stroke="#D946EF" 
                  strokeWidth={2}
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }}
                  activeDot={{ r: 8 }}
                  animationDuration={1500} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficOverviewChart;
