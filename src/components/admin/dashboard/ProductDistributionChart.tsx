
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
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

interface ProductDistributionChartProps {
  productData: Array<{ name: string; value: number }>;
  isLoading?: boolean;
}

const COLORS = ['#FF00FF', '#B026FF', '#8C1ECC', '#D580FF'];

const ProductDistributionChart: React.FC<ProductDistributionChartProps> = ({ 
  productData,
  isLoading
}) => {
  return (
    <Card className="bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Product Distribution</CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: 'none', 
                  color: '#fff',
                  borderRadius: '0.5rem'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDistributionChart;
