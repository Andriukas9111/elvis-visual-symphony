
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { useCreateStat, StatItem } from '@/hooks/api/useStats';
import { useToast } from '@/components/ui/use-toast';
import { iconOptions } from './IconSelector';

const NewStatForm: React.FC = () => {
  const { toast } = useToast();
  const createStat = useCreateStat();
  const [newStat, setNewStat] = useState<Partial<StatItem>>({
    icon_name: 'Camera',
    value: 0,
    suffix: '',
    label: '',
    sort_order: 0
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const handleNewStatChange = (field: keyof StatItem, value: any) => {
    setNewStat(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!newStat.label || !newStat.icon_name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createStat.mutateAsync(newStat as Omit<StatItem, 'id'>);
      
      setNewStat({
        icon_name: 'Camera',
        value: 0,
        suffix: '',
        label: '',
        sort_order: 0
      });
      
      toast({
        title: "Stat created",
        description: "The new stat has been successfully created."
      });
    } catch (error) {
      console.error("Error creating stat:", error);
      toast({
        title: "Creation failed",
        description: "An error occurred while creating the stat.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border rounded-md p-4 bg-elvis-dark border-gray-700">
      <h3 className="text-lg font-medium mb-4 text-white">Add New Stat</h3>
      
      <Tabs defaultValue="basic" className="mb-4">
        <TabsList className="bg-elvis-medium border-gray-700">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="icon">Select Icon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-value" className="text-white">Value</Label>
              <Input 
                id="new-value"
                type="number"
                value={newStat.value || ''}
                onChange={(e) => handleNewStatChange('value', parseInt(e.target.value) || 0)}
                className="bg-elvis-medium border-gray-700 text-white"
              />
              {newStat.value ? (
                <p className="text-xs text-gray-400 mt-1">
                  Will display as: {formatNumber(newStat.value as number)}
                </p>
              ) : null}
            </div>
            
            <div>
              <Label htmlFor="new-suffix" className="text-white">Suffix</Label>
              <Input 
                id="new-suffix"
                value={newStat.suffix || ''}
                onChange={(e) => handleNewStatChange('suffix', e.target.value)}
                placeholder="+"
                className="bg-elvis-medium border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="new-label" className="text-white">Label</Label>
              <Input 
                id="new-label"
                value={newStat.label || ''}
                onChange={(e) => handleNewStatChange('label', e.target.value)}
                placeholder="Photo Projects"
                className="bg-elvis-medium border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="new-order" className="text-white">Order</Label>
              <Input 
                id="new-order"
                type="number"
                value={newStat.sort_order || ''}
                onChange={(e) => handleNewStatChange('sort_order', parseInt(e.target.value) || 0)}
                className="bg-elvis-medium border-gray-700 text-white"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="icon" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            {iconOptions.map(category => (
              <div key={category.category} className="border border-gray-700 rounded-md p-4">
                <h4 className="text-white font-medium mb-3">{category.category}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {category.icons.map(icon => (
                    <Button
                      key={icon.value}
                      variant={newStat.icon_name === icon.value ? "default" : "outline"}
                      className={`flex items-center justify-start p-2 h-auto border-gray-700 ${
                        newStat.icon_name === icon.value ? 'bg-elvis-pink text-white' : 'text-white'
                      }`}
                      onClick={() => handleNewStatChange('icon_name', icon.value)}
                    >
                      {icon.icon}
                      <span className="ml-2 text-xs">{icon.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Stat
        </Button>
      </div>
    </div>
  );
};

export default NewStatForm;
