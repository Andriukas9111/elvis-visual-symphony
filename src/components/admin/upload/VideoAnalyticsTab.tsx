
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DownloadIcon, BarChart3, PieChart as PieChartIcon, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { VideoErrorType } from '@/components/portfolio/video-player/utils';

// Mock data (would be replaced with real data in production)
const generateMockData = () => {
  // Playback data for the last 30 days
  const playbackData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    return {
      date: formattedDate,
      views: Math.floor(Math.random() * 50) + 10,
      completions: Math.floor(Math.random() * 30) + 5,
    };
  });

  // Error categories
  const errorData = [
    { name: 'Network', value: Math.floor(Math.random() * 30) + 5, category: VideoErrorType.NETWORK },
    { name: 'Format', value: Math.floor(Math.random() * 15) + 3, category: VideoErrorType.FORMAT },
    { name: 'Not Found', value: Math.floor(Math.random() * 10) + 2, category: VideoErrorType.NOT_FOUND },
    { name: 'Decode', value: Math.floor(Math.random() * 8) + 1, category: VideoErrorType.DECODE },
    { name: 'Permission', value: Math.floor(Math.random() * 5) + 1, category: VideoErrorType.PERMISSION },
  ];

  // Popular videos
  const popularVideos = [
    { id: 1, title: 'Product Showcase', views: 342, completionRate: 78 },
    { id: 2, title: 'Behind the Scenes', views: 231, completionRate: 65 },
    { id: 3, title: 'Tutorial Series - Part 1', views: 187, completionRate: 92 },
    { id: 4, title: 'Client Testimonial', views: 153, completionRate: 89 },
    { id: 5, title: 'Company Event Highlights', views: 129, completionRate: 71 },
  ];

  return { playbackData, errorData, popularVideos };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const VideoAnalyticsTab: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'playback' | 'errors' | 'popular'>('playback');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    playbackData: any[];
    errorData: any[];
    popularVideos: any[];
  }>(generateMockData());

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      // In a real implementation, this would be an API call
      setData(generateMockData());
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [timeframe]);

  const renderPlaybackChart = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[300px] rounded-md flex items-center justify-center">
          <Skeleton className="w-full h-[300px]" />
        </div>
      );
    }

    return (
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.playbackData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#333', color: '#fff' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="views" name="Views" fill="#8884d8" />
            <Bar dataKey="completions" name="Completions" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderErrorsChart = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[300px] rounded-md flex items-center justify-center">
          <Skeleton className="w-full h-[300px]" />
        </div>
      );
    }

    return (
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.errorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.errorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#333', color: '#fff' }}
              formatter={(value, name) => [`${value} errors`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPopularVideos = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-14 w-20 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.popularVideos.map((video) => (
          <div key={video.id} className="p-3 rounded-md bg-elvis-dark hover:bg-elvis-dark/80 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-elvis-pink/20 w-16 h-12 rounded flex items-center justify-center text-elvis-pink font-bold">
                #{video.id}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{video.title}</h4>
                <div className="flex items-center text-sm text-white/60 gap-4 mt-1">
                  <span>{video.views} views</span>
                  <span>{video.completionRate}% completion</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-elvis-medium border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Video Performance Analytics</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[140px] bg-elvis-dark/50 border-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-elvis-dark border-white/10">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/10">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={(value: any) => setChartType(value)} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="playback" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Playback Stats</span>
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Error Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Popular Videos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="playback">
            {renderPlaybackChart()}
          </TabsContent>
          
          <TabsContent value="errors">
            {renderErrorsChart()}
          </TabsContent>
          
          <TabsContent value="popular">
            {renderPopularVideos()}
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 text-sm text-white/60 text-center">
          This is a demo visualization using mock data
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoAnalyticsTab;
