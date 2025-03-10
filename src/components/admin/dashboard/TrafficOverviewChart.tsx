
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

// Sample data for the chart
const sampleTrafficData = [
  { day: 'Mon', visits: 120 },
  { day: 'Tue', visits: 150 },
  { day: 'Wed', visits: 180 },
  { day: 'Thu', visits: 190 },
  { day: 'Fri', visits: 220 },
  { day: 'Sat', visits: 250 },
  { day: 'Sun', visits: 200 },
];

const TrafficOverviewChart: React.FC = () => {
  return (
    <Card className="bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Traffic Overview</CardTitle>
        <CardDescription>Daily visitor statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sampleTrafficData}
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
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#B026FF" 
                strokeWidth={2}
                dot={{ stroke: '#FF00FF', strokeWidth: 2, fill: '#FF00FF' }}
                activeDot={{ r: 8 }}
                animationDuration={1500} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficOverviewChart;
