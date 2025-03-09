
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useMakeAdmin } from '@/utils/makeAdmin';

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const makeAdmin = useMakeAdmin();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setUsers(data || []);
        
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        toast({
          title: 'Error loading users',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${newRole}`,
      });
      
      // Update user in local state to avoid refetching
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      toast({
        title: 'Error updating role',
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
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
            <TableRow key={user.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
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
                      className="cursor-pointer hover:bg-elvis-pink/20"
                    >
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateUserRole(user.id, 'moderator')}
                      className="cursor-pointer hover:bg-elvis-pink/20"
                    >
                      Make Moderator
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateUserRole(user.id, 'customer')}
                      className="cursor-pointer hover:bg-elvis-pink/20"
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
    </div>
  );
};

export default UsersManagement;
