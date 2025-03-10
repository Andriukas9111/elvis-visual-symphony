
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  FileEdit, 
  Upload, 
  Users, 
  ShoppingBag,
  Settings,
  Lightbulb
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add New Product',
      description: 'Create a product listing',
      icon: <PlusCircle className="h-5 w-5" />,
      color: 'text-green-400',
      onClick: () => navigate('/admin?tab=products')
    },
    {
      title: 'Edit Content',
      description: 'Update site content',
      icon: <FileEdit className="h-5 w-5" />,
      color: 'text-blue-400',
      onClick: () => navigate('/admin?tab=content')
    },
    {
      title: 'Upload Media',
      description: 'Add photos and videos',
      icon: <Upload className="h-5 w-5" />,
      color: 'text-purple-400',
      onClick: () => navigate('/admin?tab=media')
    },
    {
      title: 'Manage Users',
      description: 'View and edit users',
      icon: <Users className="h-5 w-5" />,
      color: 'text-yellow-400',
      onClick: () => navigate('/admin?tab=users')
    },
    {
      title: 'View Orders',
      description: 'Check recent sales',
      icon: <ShoppingBag className="h-5 w-5" />,
      color: 'text-pink-400',
      onClick: () => navigate('/admin?tab=orders')
    },
    {
      title: 'Site Settings',
      description: 'Configure your site',
      icon: <Settings className="h-5 w-5" />,
      color: 'text-orange-400',
      onClick: () => navigate('/admin?tab=settings')
    }
  ];

  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-elvis-pink" />
          Quick Actions
        </CardTitle>
        <CardDescription>Shortcuts to common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-white/10 hover:bg-elvis-light/20 hover:border-white/20 transition-all"
              onClick={action.onClick}
            >
              <div className={`mb-1 ${action.color}`}>{action.icon}</div>
              <div className="text-sm font-medium">{action.title}</div>
              <div className="text-xs text-white/70">{action.description}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
