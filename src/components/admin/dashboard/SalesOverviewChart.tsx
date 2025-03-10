
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

// Sample data for the chart
const sampleSalesData = [
  { month: 'Jan', sales: 500 },
  { month: 'Feb', sales: 800 },
  { month: 'Mar', sales: 1200 },
  { month: 'Apr', sales: 1000 },
  { month: 'May', sales: 1500 },
  { month: 'Jun', sales: 2000 },
];

const SalesOverviewChart: React.FC = () => {
  return (
    <Card className="lg:col-span-2 bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sampleSalesData}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart;
