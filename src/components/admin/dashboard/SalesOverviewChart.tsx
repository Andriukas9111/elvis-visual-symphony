
import React from 'react';
import {
  BarChart,
  Bar,
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
import { Loader2, BarChart4 } from 'lucide-react';

interface SalesData {
  month: string;
  sales: number;
}

interface SalesOverviewChartProps {
  data?: SalesData[];
  isLoading?: boolean;
  isError?: boolean;
}

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ 
  data,
  isLoading,
  isError
}) => {
  return (
    <Card className="lg:col-span-2 bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-elvis-pink" />
          Sales Overview
        </CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
            </div>
          ) : isError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">Failed to load sales data</p>
                <p className="text-xs text-white/50 mt-1">Check your database connection</p>
              </div>
            </div>
          ) : data && data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">No sales data available</p>
                <p className="text-xs text-white/50 mt-1">Complete orders will appear here</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className="animate-fade-in"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: 'none', 
                    color: '#fff',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} 
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  name="Revenue"
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart;
