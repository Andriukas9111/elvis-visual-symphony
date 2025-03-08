
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MoreHorizontal, UserCog, Package2, Image, FileText, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminAuthGuard from '@/components/AdminAuthGuard';

const AdminPanel = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [hireRequests, setHireRequests] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState({
    users: true,
    hireRequests: true,
    products: true,
    media: true
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    loadAdminData();
  }, []);
  
  const loadAdminData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (usersError) throw usersError;
      setUsers(usersData || []);
      setIsLoading(prev => ({ ...prev, users: false }));
      
      // Load hire requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('hire_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (requestsError) throw requestsError;
      setHireRequests(requestsData || []);
      setIsLoading(prev => ({ ...prev, hireRequests: false }));
      
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (productsError) throw productsError;
      setProducts(productsData || []);
      setIsLoading(prev => ({ ...prev, products: false }));
      
      // Load media
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (mediaError) throw mediaError;
      setMedia(mediaData || []);
      setIsLoading(prev => ({ ...prev, media: false }));
      
    } catch (error: any) {
      console.error('Error loading admin data:', error.message);
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.functions.invoke('auth-events', {
        body: {
          action: 'ADMIN_ACTIONS',
          adminAction: 'UPDATE_ROLE',
          userId,
          newRole
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${newRole}`,
      });
      
      // Refresh user data
      loadAdminData();
      
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const updateHireRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('hire_requests')
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Request status has been updated to ${newStatus}`,
      });
      
      // Refresh hire request data
      loadAdminData();
      
    } catch (error: any) {
      console.error('Error updating request status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const togglePublishStatus = async (table: string, itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_published: !currentStatus })
        .eq('id', itemId);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Item is now ${!currentStatus ? 'published' : 'unpublished'}`,
      });
      
      // Refresh data
      loadAdminData();
      
    } catch (error: any) {
      console.error(`Error updating ${table} status:`, error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'moderator':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-500';
      case 'contacted':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-white/70">Manage your site content, users, and requests</p>
            </div>
            
            <div 
              className="space-y-6"
              style={{ 
                opacity: 0,
                transform: 'translateY(20px)',
                animation: isLoaded ? 'fade-in 0.5s ease-out forwards' : 'none'
              }}
            >
              <Tabs defaultValue="users" className="space-y-6">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader className="pb-4">
                    <TabsList className="grid grid-cols-4 md:w-auto bg-elvis-dark">
                      <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <UserCog className="h-4 w-4" />
                        <span className="hidden sm:inline">Users</span>
                      </TabsTrigger>
                      <TabsTrigger value="hire-requests" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Hire Requests</span>
                      </TabsTrigger>
                      <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <Package2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Products</span>
                      </TabsTrigger>
                      <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <Image className="h-4 w-4" />
                        <span className="hidden sm:inline">Media</span>
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <TabsContent value="users" className="mt-0 pt-4">
                      <div className="overflow-x-auto">
                        {isLoading.users ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10">
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users.map((user) => (
                                <TableRow key={user.id} className="border-white/10">
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <Avatar>
                                        <AvatarImage src={user.avatar_url || ''} />
                                        <AvatarFallback className="bg-elvis-pink text-white">
                                          {user.full_name?.[0] || user.username?.[0] || '?'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{user.full_name || 'Unnamed'}</div>
                                        <div className="text-sm text-white/60">@{user.username}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getRoleBadgeColor(user.role)}>
                                      {user.role || 'customer'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(user.created_at).toLocaleDateString()}
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
                                          onClick={() => updateUserRole(user.id, 'admin')}
                                          className="cursor-pointer"
                                        >
                                          Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateUserRole(user.id, 'moderator')}
                                          className="cursor-pointer"
                                        >
                                          Make Moderator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateUserRole(user.id, 'customer')}
                                          className="cursor-pointer"
                                        >
                                          Reset to Customer
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hire-requests" className="mt-0 pt-4">
                      <div className="overflow-x-auto">
                        {isLoading.hireRequests ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10">
                                <TableHead>Client</TableHead>
                                <TableHead>Project Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {hireRequests.map((request) => (
                                <TableRow key={request.id} className="border-white/10">
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{request.name}</div>
                                      <div className="text-sm text-white/60">{request.email}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{request.project_type}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadgeColor(request.status)}>
                                      {request.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-elvis-medium border-white/10">
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem 
                                          onClick={() => updateHireRequestStatus(request.id, 'new')}
                                          className="cursor-pointer"
                                        >
                                          Mark as New
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateHireRequestStatus(request.id, 'contacted')}
                                          className="cursor-pointer"
                                        >
                                          Mark as Contacted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateHireRequestStatus(request.id, 'in_progress')}
                                          className="cursor-pointer"
                                        >
                                          Mark as In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateHireRequestStatus(request.id, 'completed')}
                                          className="cursor-pointer"
                                        >
                                          Mark as Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => updateHireRequestStatus(request.id, 'cancelled')}
                                          className="cursor-pointer"
                                        >
                                          Mark as Cancelled
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="products" className="mt-0 pt-4">
                      <div className="overflow-x-auto">
                        {isLoading.products ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10">
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {products.map((product) => (
                                <TableRow key={product.id} className="border-white/10">
                                  <TableCell>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-white/60">{product.slug}</div>
                                  </TableCell>
                                  <TableCell>{product.category}</TableCell>
                                  <TableCell>
                                    ${product.price}
                                    {product.sale_price && (
                                      <span className="text-sm text-white/60 ml-2">
                                        Sale: ${product.sale_price}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={product.is_published ? 
                                      'bg-green-500/10 text-green-500' : 
                                      'bg-yellow-500/10 text-yellow-500'}>
                                      {product.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => togglePublishStatus('products', product.id, product.is_published)}
                                    >
                                      {product.is_published ? 'Unpublish' : 'Publish'}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="media" className="mt-0 pt-4">
                      <div className="overflow-x-auto">
                        {isLoading.media ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10">
                                <TableHead>Media</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {media.map((item) => (
                                <TableRow key={item.id} className="border-white/10">
                                  <TableCell>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-white/60">{item.slug}</div>
                                  </TableCell>
                                  <TableCell>{item.type}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell>
                                    <Badge className={item.is_published ? 
                                      'bg-green-500/10 text-green-500' : 
                                      'bg-yellow-500/10 text-yellow-500'}>
                                      {item.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => togglePublishStatus('media', item.id, item.is_published)}
                                    >
                                      {item.is_published ? 'Unpublish' : 'Publish'}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminAuthGuard>
  );
};

export default AdminPanel;
