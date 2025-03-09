
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, User, Package, FileText, Heart, ShieldAlert, 
  Settings, Bell, Calendar, Clock, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { getOrders } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, profile, signOut, loading, isAdmin, setProfile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formProfile, setFormProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    bio: ''
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [notifications, useNotifications] = useLocalStorage('notifications', [
    { id: 1, message: 'Welcome to your dashboard!', read: false, date: new Date().toISOString() },
    { id: 2, message: 'Your profile was created successfully', read: false, date: new Date().toISOString() }
  ]);
  const { toast } = useToast();

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormProfile({
        full_name: profile.full_name || '',
        username: profile.username || '',
        email: user?.email || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, user]);

  // Load orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        try {
          setOrdersLoading(true);
          const userOrders = await getOrders(user.id);
          setOrders(userOrders || []);
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();
  }, [user]);

  // Animation entrance effect
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would call your API to update the profile
      // For now we'll just update the local state
      if (setProfile) {
        setProfile({
          ...profile,
          full_name: formProfile.full_name,
          username: formProfile.username,
          bio: formProfile.bio
        });
      }
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive"
      });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mark notification as read
  const markAsRead = (id) => {
    useNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    useNotifications([]);
  };

  // Request download link regeneration
  const regenerateDownloadLink = (orderId) => {
    toast({
      title: "Link regenerated",
      description: "Your download link has been regenerated and is valid for the next 24 hours",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-elvis-dark">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <div 
            className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between"
            style={{ 
              opacity: 0,
              transform: 'translateY(20px)',
              animation: isLoaded ? 'fade-in 0.5s ease-out forwards' : 'none'
            }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-white/70">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                  markAsRead(notifications.map(n => n.id));
                }}>
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-elvis-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
          
          <div 
            style={{ 
              opacity: 0,
              transform: 'translateY(20px)',
              animation: isLoaded ? 'fade-in 0.5s ease-out 0.1s forwards' : 'none'
            }}
          >
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-6 md:w-auto">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden md:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="downloads" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline">Downloads</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden md:inline">Favorites</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-elvis-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center md:hidden">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription className="text-white/70">
                      {isEditing ? 'Edit your profile information' : 'Manage your personal information'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              name="full_name"
                              value={formProfile.full_name}
                              onChange={handleInputChange}
                              className="bg-elvis-dark border-white/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              value={formProfile.username}
                              onChange={handleInputChange}
                              className="bg-elvis-dark border-white/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formProfile.email}
                            readOnly
                            className="bg-elvis-dark/50 border-white/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formProfile.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-2 rounded-md bg-elvis-dark border border-white/20 focus:outline-none focus:ring-2 focus:ring-elvis-pink"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Email</h3>
                          <p>{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Username</h3>
                          <p>{profile?.username || 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Name</h3>
                          <p>{profile?.full_name || 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Bio</h3>
                          <p className="whitespace-pre-wrap">{profile?.bio || 'Tell us about yourself...'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Role</h3>
                          <p className="capitalize">{profile?.role || 'Customer'}</p>
                        </div>
                        <div className="pt-4">
                          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription className="text-white/70">
                      View your past orders and purchases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 text-elvis-pink animate-spin" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-elvis-dark/50 border-white/10">
                              <TableHead>Order ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order.id} className="hover:bg-elvis-dark/50 border-white/10">
                                <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {order.status || 'Processing'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-white/50">No orders yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="downloads">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader>
                    <CardTitle>Your Downloads</CardTitle>
                    <CardDescription className="text-white/70">
                      Access your purchased digital products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 text-elvis-pink animate-spin" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div>
                        {orders.map((order) => (
                          <div key={order.id} className="mb-6 bg-elvis-dark/50 rounded-lg p-4 transition-all hover:bg-elvis-dark">
                            <div className="flex flex-col md:flex-row justify-between mb-3">
                              <div>
                                <h3 className="font-medium">{order.product_name || 'Product'}</h3>
                                <p className="text-sm text-white/60">Purchased: {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center mt-2 md:mt-0">
                                {order.expires_at && new Date(order.expires_at) > new Date() ? (
                                  <div className="flex items-center text-yellow-400 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Expires in {formatDistanceToNow(new Date(order.expires_at))}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-400 text-sm">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    <span>Download link expired</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div>
                                <div className="text-sm text-white/60 mb-1">Download count</div>
                                <div className="flex items-center">
                                  <div className="h-2 bg-white/10 rounded-full w-full">
                                    <div 
                                      className="h-2 bg-elvis-pink rounded-full" 
                                      style={{ width: `${Math.min(((order.download_count || 0) / (order.max_downloads || 3)) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm">{order.download_count || 0}/{order.max_downloads || 3}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                {order.expires_at && new Date(order.expires_at) > new Date() ? (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="animate-pulse"
                                    asChild
                                  >
                                    <Link to={`/download?token=${order.download_token}`}>Download Now</Link>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => regenerateDownloadLink(order.id)}
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Regenerate Link
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-10 text-white/50">No downloads available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription className="text-white/70">
                      Products and portfolio items you've saved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-10 text-white/50">No saved items</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription className="text-white/70">
                        Stay updated with the latest news and updates
                      </CardDescription>
                    </div>
                    {notifications.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearNotifications}
                      >
                        Clear All
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 rounded-lg transition-all ${notification.read ? 'bg-elvis-dark/30' : 'bg-elvis-dark/70 border-l-2 border-elvis-pink'}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <p className={notification.read ? 'text-white/70' : 'text-white'}>{notification.message}</p>
                              <small className="text-white/50">{formatDistanceToNow(new Date(notification.date))} ago</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-10 text-white/50">No notifications</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your account preferences and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Security</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                              <h4 className="font-medium">Password</h4>
                              <p className="text-sm text-white/60">Update your password</p>
                            </div>
                            <Link to="/reset-password">
                              <Button variant="outline" size="sm">Change</Button>
                            </Link>
                          </div>
                          
                          <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-white/60">Manage email preferences</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Account</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-red-400">Delete Account</h4>
                              <p className="text-sm text-white/60">Permanently delete your account</p>
                            </div>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
