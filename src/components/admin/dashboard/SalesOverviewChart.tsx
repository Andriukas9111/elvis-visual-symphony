
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
import { useSalesData } from '@/hooks/api/useDashboardData';

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

interface SalesData {
  month: string;
  sales: number;
}

export interface SalesOverviewChartProps {
  data?: SalesData[];
  isLoading?: boolean;
  isError?: boolean;
}

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ 
  data,
  isLoading,
  isError
}) => {
  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError
  } = useSalesData();

  // Use props if provided, otherwise use hook data
  const chartData = data || salesData;
  const loading = isLoading !== undefined ? isLoading : salesLoading;
  const error = isError !== undefined ? isError : salesError;

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
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">Failed to load sales data</p>
                <p className="text-xs text-white/50 mt-1">Check your database connection</p>
              </div>
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/70">No sales data available</p>
                <p className="text-xs text-white/50 mt-1">Start selling to see analytics</p>
              </div>
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
