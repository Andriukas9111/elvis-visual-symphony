
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Mail, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HireRequest {
  id: string;
  name: string;
  company?: string;
  project_type: string;
  status: string;
  created_at: string;
}

interface RecentHireRequestsProps {
  recentHireRequests: HireRequest[];
  isLoading: boolean;
  isError: boolean;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const RecentHireRequests: React.FC<RecentHireRequestsProps> = ({
  recentHireRequests,
  isLoading,
  isError
}) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-elvis-medium border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-elvis-pink" />
          Recent Hire Requests
        </CardTitle>
        <CardDescription>Latest client inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-elvis-light/20 animate-pulse">
                <div className="h-5 w-1/3 bg-elvis-light/30 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-elvis-light/30 rounded mb-2"></div>
                <div className="h-3 w-1/4 bg-elvis-light/30 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-white/70">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p>Failed to load recent hire requests</p>
            <p className="text-xs text-white/50 mt-1">Check your database connection</p>
          </div>
        ) : recentHireRequests.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No hire requests yet</p>
            <p className="text-xs text-white/50 mt-1">New requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentHireRequests.map((request) => (
              <div key={request.id} className="flex items-start justify-between p-4 rounded-lg bg-elvis-light/20 hover:bg-elvis-light/30 transition-colors">
                <div>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-white/70">
                    {request.project_type.charAt(0).toUpperCase() + request.project_type.slice(1)} 
                    {request.company ? ` - ${request.company}` : ''}
                  </div>
                  <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" />
                    {formatDate(request.created_at)}
                  </div>
                </div>
                <Badge 
                  className={
                    request.status === 'new' 
                      ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                      : request.status === 'contacted' 
                      ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                      : request.status === 'in_progress'
                      ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                      : request.status === 'completed'
                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  }
                >
                  {formatStatus(request.status)}
                </Badge>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin?tab=hire-requests')}
              className="w-full mt-2 border-white/10 hover:bg-elvis-pink/20 hover:border-elvis-pink/40 transition-colors"
            >
              View All Hire Requests
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentHireRequests;
