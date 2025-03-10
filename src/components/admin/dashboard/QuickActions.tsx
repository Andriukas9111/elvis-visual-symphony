
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2Icon, ImageIcon, FileTextIcon, ShoppingCart, BarChart4 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    console.log(`Quick action triggered: ${action}`);
    
    switch(action) {
      case 'Add Product':
        toast({
          title: 'Navigating to Products',
          description: 'Taking you to the products management section'
        });
        navigate('/admin?tab=products');
        break;
      case 'Add Media':
        toast({
          title: 'Navigating to Media',
          description: 'Taking you to the media management section'
        });
        navigate('/admin?tab=media');
        break;
      case 'Update Content':
        toast({
          title: 'Navigating to Content',
          description: 'Taking you to the content management section'
        });
        navigate('/admin?tab=content');
        break;
      case 'Process Orders':
        toast({
          title: 'Navigating to Orders',
          description: 'Taking you to the orders management section'
        });
        navigate('/admin?tab=orders');
        break;
      case 'View Analytics':
        toast({
          title: 'Analytics',
          description: 'Advanced analytics will be available in a future update',
        });
        break;
      default:
        toast({
          title: 'Action triggered',
          description: `${action} action has been triggered`,
        });
    }
  };

  return (
    <Card className="bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
            onClick={() => handleQuickAction('Add Product')}
          >
            <Package2Icon className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
            onClick={() => handleQuickAction('Add Media')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Media
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
            onClick={() => handleQuickAction('Update Content')}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            Update Content
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
            onClick={() => handleQuickAction('Process Orders')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Process Orders
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300 col-span-2"
            onClick={() => handleQuickAction('View Analytics')}
          >
            <BarChart4 className="mr-2 h-4 w-4" />
            View Full Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
