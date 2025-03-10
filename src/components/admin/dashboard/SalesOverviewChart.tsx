
import React from 'react';
import {
  BarChart,
  Bar,
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
import { Loader2 } from 'lucide-react';

interface SalesData {
  month: string;
  sales: number;
}

interface SalesOverviewChartProps {
  data?: SalesData[];
  isLoading?: boolean;
}

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ 
  data,
  isLoading
}) => {
  // Default sample data if no data is provided
  const sampleSalesData = [
    { month: 'Jan', sales: 500 },
    { month: 'Feb', sales: 800 },
    { month: 'Mar', sales: 1200 },
    { month: 'Apr', sales: 1000 },
    { month: 'May', sales: 1500 },
    { month: 'Jun', sales: 2000 },
  ];

  const chartData = data || sampleSalesData;

  return (
    <Card className="lg:col-span-2 bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                />
                <Bar 
                  dataKey="sales" 
                  fill="#FF00FF" 
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
