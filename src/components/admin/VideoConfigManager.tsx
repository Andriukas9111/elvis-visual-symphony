
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Loader2, Film } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface VideoConfig {
  id: string;
  autoplay_default: boolean;
  loop_default: boolean;
  default_volume: number;
  preload_strategy: 'auto' | 'metadata' | 'none';
  quality_selection: 'auto' | 'high' | 'medium' | 'low';
  enable_theater_mode: boolean;
  mute_on_autoplay: boolean;
  enable_keyboard_shortcuts: boolean;
}

const defaultConfig: VideoConfig = {
  id: 'global',
  autoplay_default: false,
  loop_default: false,
  default_volume: 0.7,
  preload_strategy: 'metadata',
  quality_selection: 'auto',
  enable_theater_mode: true,
  mute_on_autoplay: true,
  enable_keyboard_shortcuts: true,
};

const VideoConfigManager: React.FC = () => {
  const [config, setConfig] = useState<VideoConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('video_config')
          .select('*')
          .eq('id', 'global')
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, we'll create it
            console.log('No video config found, will create default');
            setConfig(defaultConfig);
          } else {
            throw error;
          }
        } else if (data) {
          setConfig(data);
        }
      } catch (error: any) {
        console.error('Error fetching video config:', error.message);
        toast({
          title: 'Error loading configuration',
          description: 'Failed to load video configuration settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, [toast]);

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('video_config')
        .upsert(config, { onConflict: 'id' })
        .select()
        .single();
        
      if (error) throw error;
      
      setConfig(data);
      
      toast({
        title: 'Configuration saved',
        description: 'Video player configuration has been updated.',
      });
      
      // In a real application, you would also trigger a global state update
      // or dispatch an event to update players across the application
      
    } catch (error: any) {
      console.error('Error saving video config:', error.message);
      toast({
        title: 'Save failed',
        description: error.message || 'Failed to save video configuration',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-elvis-medium border-none">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <div className="flex flex-col items-center text-white/60">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading video configuration...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-elvis-medium border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Settings className="mr-2 h-5 w-5 text-elvis-pink" />
              Video Player Configuration
            </CardTitle>
            <CardDescription className="text-white/60">
              Manage global settings for all video players across the site
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="playback">Playback</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Behavior</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoplay">Default Autoplay</Label>
                    <p className="text-sm text-white/60">
                      Automatically start playing videos when they appear
                    </p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={config.autoplay_default}
                    onCheckedChange={(checked) => setConfig({...config, autoplay_default: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loop">Default Loop</Label>
                    <p className="text-sm text-white/60">
                      Automatically loop videos when they finish playing
                    </p>
                  </div>
                  <Switch
                    id="loop"
                    checked={config.loop_default}
                    onCheckedChange={(checked) => setConfig({...config, loop_default: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theaterMode">Enable Theater Mode</Label>
                    <p className="text-sm text-white/60">
                      Allow videos to expand to a larger view on click
                    </p>
                  </div>
                  <Switch
                    id="theaterMode"
                    checked={config.enable_theater_mode}
                    onCheckedChange={(checked) => setConfig({...config, enable_theater_mode: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quality Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="quality">Default Quality Selection</Label>
                  <Select 
                    value={config.quality_selection} 
                    onValueChange={(value: any) => setConfig({...config, quality_selection: value})}
                  >
                    <SelectTrigger className="w-full bg-elvis-dark/50 border-white/10">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent className="bg-elvis-dark border-white/10">
                      <SelectItem value="auto">Auto (recommended)</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-white/60">
                    Choose how video quality is selected by default
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preload">Preload Strategy</Label>
                  <Select 
                    value={config.preload_strategy} 
                    onValueChange={(value: any) => setConfig({...config, preload_strategy: value})}
                  >
                    <SelectTrigger className="w-full bg-elvis-dark/50 border-white/10">
                      <SelectValue placeholder="Select preload strategy" />
                    </SelectTrigger>
                    <SelectContent className="bg-elvis-dark border-white/10">
                      <SelectItem value="auto">Auto (preload entire video)</SelectItem>
                      <SelectItem value="metadata">Metadata Only (default)</SelectItem>
                      <SelectItem value="none">None (save bandwidth)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-white/60">
                    Controls how videos are preloaded to balance performance and bandwidth
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="playback" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="volume">Default Volume</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="volume"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[config.default_volume]}
                    onValueChange={(values) => setConfig({...config, default_volume: values[0]})}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-center">
                    {Math.round(config.default_volume * 100)}%
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  Set the default volume level for videos
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="muteAutoplay">Mute on Autoplay</Label>
                  <p className="text-sm text-white/60">
                    Automatically mute videos that autoplay to improve user experience
                  </p>
                </div>
                <Switch
                  id="muteAutoplay"
                  checked={config.mute_on_autoplay}
                  onCheckedChange={(checked) => setConfig({...config, mute_on_autoplay: checked})}
                />
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Playback Preview</h3>
                <p className="text-sm text-white/60">
                  Changes to these settings will affect all videos on the site. The preview will be available in the live version.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyboardShortcuts">Keyboard Shortcuts</Label>
                  <p className="text-sm text-white/60">
                    Enable keyboard shortcuts for video control (space, arrows, etc.)
                  </p>
                </div>
                <Switch
                  id="keyboardShortcuts"
                  checked={config.enable_keyboard_shortcuts}
                  onCheckedChange={(checked) => setConfig({...config, enable_keyboard_shortcuts: checked})}
                />
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Configuration Import/Export</h3>
                <p className="text-sm text-white/60 mb-4">
                  Backup or restore your video player configuration
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-white/10">
                    Export Config
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/10">
                    Import Config
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h3 className="text-lg font-medium">Reset Configuration</h3>
                <p className="text-sm text-white/60 mb-4">
                  Restore to default settings
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setConfig(defaultConfig);
                    toast({
                      title: 'Configuration reset',
                      description: 'Settings have been reset to defaults (not saved yet)',
                    });
                  }}
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-white/10 pt-6 flex justify-end gap-2">
        <Button variant="outline" className="border-white/10">
          Cancel
        </Button>
        <Button 
          onClick={saveConfig}
          disabled={isSaving}
          className="bg-elvis-pink hover:bg-elvis-pink/80"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoConfigManager;
