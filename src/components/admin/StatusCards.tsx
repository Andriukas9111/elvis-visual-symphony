
import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Mail,
  ArrowUpRight
} from 'lucide-react';

interface StatusCardsProps {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingRequests: number;
  };
}

const StatusCards: React.FC<StatusCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <>
      {/* Users Card */}
      <Card className="bg-elvis-medium border-none overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-elvis-purple/10 to-elvis-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="mt-3">
            <p className="text-sm text-white/70">Total Users</p>
            <h3 className="text-2xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</h3>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">+12% this month</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders Card */}
      <Card className="bg-elvis-medium border-none overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-green-500" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="mt-3">
            <p className="text-sm text-white/70">Total Orders</p>
            <h3 className="text-2xl font-bold mt-1">{stats.totalOrders.toLocaleString()}</h3>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">+8% this week</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Revenue Card */}
      <Card className="bg-elvis-medium border-none overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-elvis-pink/10 to-elvis-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-elvis-pink/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-elvis-pink" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-elvis-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="mt-3">
            <p className="text-sm text-white/70">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-elvis-pink/10 text-elvis-pink">+15% this month</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Requests Card */}
      <Card className="bg-elvis-medium border-none overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-amber-500" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="mt-3">
            <p className="text-sm text-white/70">Pending Requests</p>
            <h3 className="text-2xl font-bold mt-1">{stats.pendingRequests.toLocaleString()}</h3>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">Requires attention</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusCards;
