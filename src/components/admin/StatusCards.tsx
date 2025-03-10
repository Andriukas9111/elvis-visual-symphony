
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Clock } from 'lucide-react';

interface StatCardsProps {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingRequests: number;
  };
}

const StatusCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <>
      <Card className="bg-elvis-medium border-none">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/70">Total Users</p>
            <h4 className="text-2xl font-bold">{stats.totalUsers}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/70">Total Revenue</p>
            <h4 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 mr-4">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/70">Orders</p>
            <h4 className="text-2xl font-bold">{stats.totalOrders}</h4>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/70">Pending Requests</p>
            <h4 className="text-2xl font-bold">{stats.pendingRequests}</h4>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusCards;
