
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
import { RefreshCw, AlertCircle, Mail } from 'lucide-react';
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
  error: Error | null;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const RecentHireRequests: React.FC<RecentHireRequestsProps> = ({
  recentHireRequests,
  isLoading,
  error
}) => {
  const navigate = useNavigate();

  return (
    <Card className="lg:col-span-2 bg-elvis-medium border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Hire Requests</CardTitle>
        <CardDescription>Latest client inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-elvis-pink" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-white/70">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p>Failed to load recent hire requests</p>
          </div>
        ) : recentHireRequests.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No hire requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentHireRequests.map((request) => (
              <div key={request.id} className="flex items-start justify-between p-4 rounded-lg bg-elvis-light/30">
                <div>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-white/70">
                    {request.project_type.charAt(0).toUpperCase() + request.project_type.slice(1)} 
                    {request.company ? ` - ${request.company}` : ''}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge 
                  className={
                    request.status === 'new' 
                      ? 'bg-blue-500/10 text-blue-500' 
                      : request.status === 'contacted' 
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : request.status === 'in_progress'
                      ? 'bg-purple-500/10 text-purple-500'
                      : request.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
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
              className="w-full mt-2 border-dashed border-white/20 hover:bg-elvis-pink/20 hover:border-elvis-pink"
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
