
import React, { useState, useEffect } from 'react';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoadingState from '../AdminLoadingState';
import { LucideCode, LucideEye, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StatsEditor = () => {
  const { data: contentData, isLoading } = useContent('about');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('visual');
  
  const statsContent = contentData?.find(item => 
    item.section === 'about' && item.media_url === 'stats'
  ) || null;
  
  const defaultStats = [
    { 
      id: 1, 
      iconName: 'Camera', 
      value: 350, 
      suffix: '+', 
      label: 'Photo Projects' 
    },
    { 
      id: 2, 
      iconName: 'Video', 
      value: 120, 
      suffix: '+',  
      label: 'Video Productions' 
    },
    { 
      id: 3, 
      iconName: 'Award', 
      value: 28, 
      suffix: '',  
      label: 'Industry Awards' 
    },
    { 
      id: 4, 
      iconName: 'Users', 
      value: 45, 
      suffix: '+',  
      label: 'Happy Clients' 
    }
  ];

  const [statsJson, setStatsJson] = useState<string>(JSON.stringify(defaultStats, null, 2));
  const [visualStats, setVisualStats] = useState<any[]>(defaultStats);
  
  // Load data when it's available
  useEffect(() => {
    if (statsContent?.content) {
      try {
        const parsedStats = JSON.parse(statsContent.content);
        setStatsJson(JSON.stringify(parsedStats, null, 2));
        setVisualStats(parsedStats);
      } catch (error) {
        console.error('Error parsing stats content:', error);
        setStatsJson(JSON.stringify(defaultStats, null, 2));
        setVisualStats(defaultStats);
      }
    } else {
      setStatsJson(JSON.stringify(defaultStats, null, 2));
      setVisualStats(defaultStats);
    }
  }, [statsContent]);
  
  // Update visual stats when JSON changes
  const updateVisualFromJson = () => {
    try {
      const parsed = JSON.parse(statsJson);
      setVisualStats(parsed);
      return true;
    } catch (error) {
      console.error('Invalid JSON', error);
      toast.error('Invalid JSON. Please check your syntax.');
      return false;
    }
  };
  
  // Update JSON when visual stats change
  const updateJsonFromVisual = () => {
    setStatsJson(JSON.stringify(visualStats, null, 2));
  };
  
  const handleStatChange = (index: number, field: string, value: any) => {
    const newStats = [...visualStats];
    newStats[index] = { ...newStats[index], [field]: value };
    setVisualStats(newStats);
    // Don't update JSON immediately to avoid constant re-renders
  };
  
  const addStat = () => {
    const newStat = { 
      id: Date.now(), 
      iconName: 'Star', 
      value: 0, 
      suffix: '', 
      label: 'New Stat' 
    };
    setVisualStats([...visualStats, newStat]);
    // Don't update JSON immediately
  };
  
  const removeStat = (index: number) => {
    const newStats = [...visualStats];
    newStats.splice(index, 1);
    setVisualStats(newStats);
    // Don't update JSON immediately
  };
  
  const handleSaveStats = async () => {
    let statsToSave;
    
    if (activeTab === 'json') {
      // When saving from JSON tab, validate first
      if (!updateVisualFromJson()) return;
      statsToSave = statsJson;
    } else {
      // When saving from visual tab, update JSON first
      updateJsonFromVisual();
      statsToSave = JSON.stringify(visualStats);
    }
    
    setIsSubmitting(true);
    try {
      if (statsContent) {
        await updateContentMutation.mutateAsync({
          id: statsContent.id,
          updates: {
            content: statsToSave,
            section: 'about',
            media_url: 'stats'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: statsToSave,
          section: 'about',
          media_url: 'stats',
          is_published: true
        });
      }
      
      toast.success('Stats saved successfully');
    } catch (error) {
      console.error('Error saving stats:', error);
      toast.error('Failed to save stats');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Manage the statistics displayed in the About section</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="visual" className="flex items-center gap-1">
                  <LucideEye size={14} />
                  <span>Visual Editor</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="json" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    // Update JSON from visual stats before switching
                    if (activeTab === 'visual') {
                      updateJsonFromVisual();
                    }
                  }}
                >
                  <LucideCode size={14} />
                  <span>JSON Editor</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="visual" className="mt-0 space-y-4">
            <div className="space-y-4">
              {visualStats.map((stat, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 border rounded-md">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`iconName-${index}`}>Icon Name</Label>
                      <Input
                        id={`iconName-${index}`}
                        value={stat.iconName}
                        onChange={(e) => handleStatChange(index, 'iconName', e.target.value)}
                        placeholder="Icon name (e.g. Camera, Video, Award)"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`label-${index}`}>Label</Label>
                      <Input
                        id={`label-${index}`}
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                        placeholder="Label (e.g. Photo Projects)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`value-${index}`}>Value</Label>
                      <Input
                        id={`value-${index}`}
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', parseInt(e.target.value) || 0)}
                        placeholder="Numeric value"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`suffix-${index}`}>Suffix</Label>
                      <Input
                        id={`suffix-${index}`}
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                        placeholder="Suffix (e.g. +, %)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={addStat}
              >
                <Plus className="h-4 w-4" />
                Add Stat
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="mt-0">
            <div className="space-y-2">
              <Label htmlFor="stats">Stats JSON</Label>
              <Textarea
                id="stats"
                value={statsJson}
                onChange={(e) => setStatsJson(e.target.value)}
                placeholder='Enter stats data in JSON format'
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: Array of objects with id, iconName, value, suffix, and label properties
              </p>
              
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={updateVisualFromJson}
              >
                Validate JSON
              </Button>
            </div>
          </TabsContent>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveStats} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save Stats'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StatsEditor;
