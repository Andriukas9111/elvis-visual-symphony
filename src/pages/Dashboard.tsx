
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Package, FileText, Heart, ShieldAlert, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-elvis-dark">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }

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
              <TabsList className="grid grid-cols-5 md:w-auto">
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
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <h3 className="text-sm font-medium text-white/70">Role</h3>
                        <p className="capitalize">{profile?.role || 'Customer'}</p>
                      </div>
                      <div className="pt-4">
                        <Button>Edit Profile</Button>
                      </div>
                    </div>
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
                    <p className="text-center py-10 text-white/50">No orders yet</p>
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
                    <p className="text-center py-10 text-white/50">No downloads available</p>
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
