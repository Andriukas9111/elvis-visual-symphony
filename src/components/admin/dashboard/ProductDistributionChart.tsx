
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
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
import { Loader2, Package } from 'lucide-react';

interface ProductData {
  name: string;
  value: number;
}

interface ProductDistributionChartProps {
  productData?: ProductData[];
  isLoading?: boolean;
  isError?: boolean;
}

const DEFAULT_PRODUCT_DATA: ProductData[] = [
  { name: 'Presets', value: 48 },
  { name: 'LUTs', value: 32 },
  { name: 'Tutorials', value: 16 },
  { name: 'Stock footage', value: 24 },
  { name: 'Sound FX', value: 8 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F97316', '#14B8A6'];

const ProductDistributionChart: React.FC<ProductDistributionChartProps> = ({ 
  productData = DEFAULT_PRODUCT_DATA,
  isLoading = false,
  isError = false
}) => {
  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Package className="h-5 w-5 text-elvis-pink" />
          Product Distribution
        </CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
          ) : isError ? (
            <div className="text-center">
              <p className="text-sm text-white/70">Failed to load data</p>
              <p className="text-xs text-white/50 mt-1">Check your database connection</p>
            </div>
          ) : productData.length === 0 ? (
            <div className="text-center">
              <p className="text-sm text-white/70">No product data available</p>
              <p className="text-xs text-white/50 mt-1">Add products to see distribution</p>
            </div>
          ) : (
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
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
                  formatter={(value, name) => [`${value} items`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDistributionChart;
