
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface StatCardsProps {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingRequests: number;
  };
  isLoading?: boolean;
}

const StatusCards: React.FC<StatCardsProps> = ({ stats, isLoading }) => {
  return (
    <>
      <Card className="bg-elvis-medium border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mr-4 z-10">
              <Users className="h-6 w-6" />
            </div>
            <div className="z-10">
              <p className="text-sm text-white/70">Total Users</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-elvis-light/20 animate-pulse rounded"></div>
                  ) : (
                    stats.totalUsers.toLocaleString()
                  )}
                </h4>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-0.5" />8%
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5">
              <Users className="h-24 w-24 -mb-4 -mr-4" />
            </div>
          </div>
          <div className="h-1 bg-blue-500/30"></div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mr-4 z-10">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="z-10">
              <p className="text-sm text-white/70">Total Revenue</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-20 bg-elvis-light/20 animate-pulse rounded"></div>
                  ) : (
                    `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  )}
                </h4>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-0.5" />12%
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5">
              <DollarSign className="h-24 w-24 -mb-4 -mr-4" />
            </div>
          </div>
          <div className="h-1 bg-green-500/30"></div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 mr-4 z-10">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="z-10">
              <p className="text-sm text-white/70">Orders</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-12 bg-elvis-light/20 animate-pulse rounded"></div>
                  ) : (
                    stats.totalOrders.toLocaleString()
                  )}
                </h4>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-0.5" />5%
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5">
              <ShoppingCart className="h-24 w-24 -mb-4 -mr-4" />
            </div>
          </div>
          <div className="h-1 bg-purple-500/30"></div>
        </CardContent>
      </Card>
      
      <Card className="bg-elvis-medium border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 mr-4 z-10">
              <Clock className="h-6 w-6" />
            </div>
            <div className="z-10">
              <p className="text-sm text-white/70">Pending Requests</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-12 bg-elvis-light/20 animate-pulse rounded"></div>
                  ) : (
                    stats.pendingRequests.toLocaleString()
                  )}
                </h4>
                {stats.pendingRequests > 0 ? (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500">
                    Needs action
                  </span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                    All clear
                  </span>
                )}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5">
              <Clock className="h-24 w-24 -mb-4 -mr-4" />
            </div>
          </div>
          <div className="h-1 bg-yellow-500/30"></div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusCards;
