
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Package, FileText, Mail, AlertTriangle, CheckCircle2, ShoppingCart } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user_joined' | 'order_placed' | 'product_added' | 'media_added' | 'hire_request' | 'content_updated';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_joined':
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'order_placed':
      return <ShoppingCart className="h-5 w-5 text-green-500" />;
    case 'product_added':
      return <Package className="h-5 w-5 text-purple-500" />;
    case 'media_added':
      return <FileText className="h-5 w-5 text-yellow-500" />;
    case 'hire_request':
      return <Mail className="h-5 w-5 text-elvis-pink" />;
    case 'content_updated':
      return <FileText className="h-5 w-5 text-orange-500" />;
    default:
      return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const styles = {
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    error: 'bg-red-500/10 text-red-500',
    info: 'bg-blue-500/10 text-blue-500',
  };
  
  return (
    <Badge className={status in styles ? styles[status as keyof typeof styles] : styles.info}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Sample activity data until we connect to real-time data
const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'user_joined',
    title: 'New User Registered',
    description: 'John Doe joined the platform',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    user: {
      name: 'John Doe',
      avatar: '',
    },
    status: 'success',
  },
  {
    id: '2',
    type: 'order_placed',
    title: 'New Order',
    description: 'Jane Smith purchased Lightroom Presets Pack',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    user: {
      name: 'Jane Smith',
      avatar: '',
    },
    status: 'success',
  },
  {
    id: '3',
    type: 'hire_request',
    title: 'New Hire Request',
    description: 'Mike Johnson submitted a project inquiry',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    user: {
      name: 'Mike Johnson',
      avatar: '',
    },
    status: 'info',
  },
  {
    id: '4',
    type: 'product_added',
    title: 'New Product Added',
    description: 'Cinematic LUTs Pack was added to the store',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: 'success',
  },
  {
    id: '5',
    type: 'content_updated',
    title: 'Content Updated',
    description: 'Homepage hero section was updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'info',
  },
];

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // This will be replaced with real-time subscriptions in future
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setActivities(sampleActivities);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate real-time updates by adding a random activity periodically
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      const randomActivity = {
        ...sampleActivities[Math.floor(Math.random() * sampleActivities.length)],
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      
      // Add new activity with animation effect
      setActivities(prev => [randomActivity, ...prev.slice(0, 9)]);
      
    }, 15000); // Add new activity every 15 seconds
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDay = Math.floor(diffInHour / 24);
    
    if (diffInSec < 60) {
      return 'just now';
    } else if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInHour < 24) {
      return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div 
          key={activity.id}
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-elvis-light/50 transition-colors"
          style={{
            animation: `fade-in 0.5s ease-out ${index * 0.1}s forwards`,
            opacity: 0,
          }}
        >
          <div className="flex-shrink-0">
            {activity.user ? (
              <Avatar>
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-elvis-pink text-white">
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-elvis-light">
                {getActivityIcon(activity.type)}
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">{activity.title}</p>
              <span className="text-xs text-white/60">{formatTimestamp(activity.timestamp)}</span>
            </div>
            <p className="text-sm text-white/80">{activity.description}</p>
            {activity.status && (
              <div className="mt-2">
                {getStatusBadge(activity.status)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
