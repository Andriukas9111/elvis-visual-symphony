
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
  FileText, 
  Upload, 
  Users, 
  ShoppingBag, 
  Megaphone, 
  Settings,
  PlusCircle
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: 'Add new media',
      icon: <Upload className="h-5 w-5" />,
      click: () => navigate('/admin?tab=media'),
      color: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'
    },
    {
      title: 'Create product',
      icon: <ShoppingBag className="h-5 w-5" />,
      click: () => navigate('/admin?tab=products'),
      color: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
    },
    {
      title: 'Edit content',
      icon: <FileText className="h-5 w-5" />,
      click: () => navigate('/admin?tab=content'),
      color: 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20'
    },
    {
      title: 'Manage users',
      icon: <Users className="h-5 w-5" />,
      click: () => navigate('/admin?tab=users'),
      color: 'bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20'
    },
    {
      title: 'Email subscribers',
      icon: <Megaphone className="h-5 w-5" />,
      click: () => navigate('/admin?tab=subscribers'),
      color: 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
    },
    {
      title: 'Site settings',
      icon: <Settings className="h-5 w-5" />,
      click: () => navigate('/admin?tab=content'),
      color: 'bg-gray-500/10 text-gray-400 group-hover:bg-gray-500/20'
    }
  ];
  
  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-elvis-pink" />
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
              className="group h-auto py-4 flex flex-col items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-elvis-light/20 border-white/10"
              onClick={action.click}
            >
              <div className={`rounded-full p-2 ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-sm">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
