
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
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  UserCog, 
  Package2Icon as Package2, 
  ImageIcon as Image, 
  FileTextIcon as FileText, 
  Mail, 
  LayoutDashboard, 
  BarChart4,
  Activity,
  Edit,
  Database
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UsersManagement from '@/components/admin/UsersManagement';
import HireRequestsManagement from '@/components/admin/HireRequestsManagement';
import ProductsManagement from '@/components/admin/ProductsManagement';
import MediaManagement from '@/components/admin/MediaManagement';
import ContentEditor from '@/components/admin/ContentEditor';

const AdminPanel = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);
  
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
              <Tabs defaultValue="dashboard" className="space-y-6">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader className="pb-4">
                    <TabsList className="grid grid-cols-6 md:w-auto bg-elvis-dark">
                      <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </TabsTrigger>
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
                      <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Content</span>
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <TabsContent value="dashboard" className="mt-0 pt-4">
                      <AdminDashboard />
                    </TabsContent>
                    
                    <TabsContent value="users" className="mt-0 pt-4">
                      <UsersManagement />
                    </TabsContent>
                    
                    <TabsContent value="hire-requests" className="mt-0 pt-4">
                      <HireRequestsManagement />
                    </TabsContent>
                    
                    <TabsContent value="products" className="mt-0 pt-4">
                      <ProductsManagement />
                    </TabsContent>
                    
                    <TabsContent value="media" className="mt-0 pt-4">
                      <MediaManagement />
                    </TabsContent>
                    
                    <TabsContent value="content" className="mt-0 pt-4">
                      <ContentEditor />
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
