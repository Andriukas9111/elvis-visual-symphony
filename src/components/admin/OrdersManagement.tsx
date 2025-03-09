
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Search, 
  MoreHorizontal, 
  FilterIcon, 
  ChevronDown,
  ShoppingCart,
  DollarSign,
  Download,
  ClipboardCheck,
  MailCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  payment_status: string;
  products: string[];
  download_count: number;
  download_limit: number;
  user?: {
    full_name?: string;
    username?: string;
    email?: string;
    avatar_url?: string;
  };
}

const OrdersManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    revenue: 0
  });
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Get orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // For each order, get the user's profile information
        const ordersWithUsers = await Promise.all((ordersData || []).map(async (order) => {
          if (!order.user_id) return { ...order, user: null };
          
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('full_name, username, avatar_url')
            .eq('id', order.user_id)
            .single();
            
          if (userError) {
            console.error('Error fetching user:', userError.message);
            return { ...order, user: null };
          }
          
          return { ...order, user: userData };
        }));
        
        setOrders(ordersWithUsers);
        
        // Calculate order statistics
        const completed = ordersWithUsers.filter(o => o.payment_status === 'completed').length;
        const pending = ordersWithUsers.filter(o => o.payment_status === 'pending').length;
        const revenue = ordersWithUsers
          .filter(o => o.payment_status === 'completed')
          .reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        setOrderStats({
          total: ordersWithUsers.length,
          completed,
          pending,
          revenue
        });
        
      } catch (error: any) {
        console.error('Error fetching orders:', error.message);
        toast({
          title: 'Error loading orders',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);
  
  // Filter orders based on search query and filters
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        (order.user?.username && order.user.username.toLowerCase().includes(query)) ||
        (order.user?.full_name && order.user.full_name.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.payment_status === statusFilter);
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0); // 1970
      }
      
      filtered = filtered.filter(order => 
        new Date(order.created_at) >= startDate
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, timeFilter]);
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast({
        title: 'Order status updated',
        description: `Order status has been changed to ${newStatus}`,
      });
      
      // Update orders in local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );
      
    } catch (error: any) {
      console.error('Error updating order status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      case 'refunded':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };
  
  const sendOrderConfirmation = async (orderId: string) => {
    // This function would trigger an Edge Function to send an email to the customer
    toast({
      title: 'Confirmation sent',
      description: 'Order confirmation has been sent to the customer',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-elvis-light border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-elvis-pink mr-2" />
              <div className="text-2xl font-bold">{orderStats.total}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-elvis-light border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{orderStats.completed}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-elvis-light border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Download className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">{orderStats.pending}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-elvis-light border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-elvis-pink mr-2" />
              <div className="text-2xl font-bold">${orderStats.revenue.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-elvis-light border-white/10"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-white/60" />
            <span className="text-sm">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-elvis-light border border-white/10 rounded px-2 py-1 text-sm"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Period:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-elvis-light border border-white/10 rounded px-2 py-1 text-sm"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center py-8 text-white/60">
                  No orders found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
                  <TableCell>
                    <div className="font-medium">{order.id.slice(0, 8)}...</div>
                    <div className="text-sm text-white/60">{order.products?.length || 0} items</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {order.user && (
                        <>
                          <div className="font-medium">{order.user.full_name || 'Anonymous'}</div>
                          <div className="text-sm text-white/60">@{order.user.username}</div>
                        </>
                      )}
                      {!order.user && <div className="text-white/60">Unknown user</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(order.payment_status)}>
                      {order.payment_status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-elvis-medium border-white/10">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="cursor-pointer hover:bg-elvis-pink/20"
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateOrderStatus(order.id, 'pending')}
                          className="cursor-pointer hover:bg-elvis-pink/20"
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateOrderStatus(order.id, 'refunded')}
                          className="cursor-pointer hover:bg-elvis-pink/20"
                        >
                          Mark as Refunded
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => sendOrderConfirmation(order.id)}
                          className="cursor-pointer hover:bg-elvis-pink/20"
                        >
                          <MailCheck className="h-4 w-4 mr-2" />
                          Send Confirmation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersManagement;
