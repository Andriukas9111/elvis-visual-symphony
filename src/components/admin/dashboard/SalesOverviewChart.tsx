
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, DollarSign } from 'lucide-react';

// Custom tooltip to format currency values
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const amount = payload[0].value;
    // Use type check before using toFixed
    const formattedAmount = typeof amount === 'number' 
      ? `$${amount.toFixed(2)}` 
      : `$${amount}`;

    return (
      <div className="custom-tooltip bg-elvis-light p-3 rounded shadow-md">
        <p className="label font-medium text-white">{label}</p>
        <p className="value text-elvis-pink font-semibold">{formattedAmount}</p>
      </div>
    );
  }
  
  return null;
};

export interface SalesData {
  month: string;
  sales: number;
}

export interface SalesOverviewChartProps {
  salesData?: SalesData[];
  isLoading?: boolean;
  isError?: boolean;
}

// Default static data for the chart
const DEFAULT_SALES_DATA: SalesData[] = [
  { month: 'Jan 2023', sales: 4500 },
  { month: 'Feb 2023', sales: 5200 },
  { month: 'Mar 2023', sales: 4800 },
  { month: 'Apr 2023', sales: 6300 },
  { month: 'May 2023', sales: 5900 },
  { month: 'Jun 2023', sales: 7500 },
  { month: 'Jul 2023', sales: 9200 },
  { month: 'Aug 2023', sales: 8700 },
  { month: 'Sep 2023', sales: 10200 },
  { month: 'Oct 2023', sales: 11500 },
  { month: 'Nov 2023', sales: 13200 },
  { month: 'Dec 2023', sales: 15800 },
];

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ 
  salesData = DEFAULT_SALES_DATA,
  isLoading = false,
  isError = false
}) => {
  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-elvis-pink" />
          Sales Overview
        </CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
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
                <p className="text-sm text-white/70">Failed to load sales data</p>
                <p className="text-xs text-white/50 mt-1">Check your database connection</p>
              </div>
            </div>
          ) : !salesData || salesData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">No sales data available</p>
                <p className="text-xs text-white/50 mt-1">Start selling to see analytics</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className="animate-fade-in"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                <YAxis 
                  tickFormatter={(value) => typeof value === 'number' ? `$${value}` : `$${value}`}
                  tick={{ fill: '#fff' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sales" 
                  fill="#D946EF"
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
