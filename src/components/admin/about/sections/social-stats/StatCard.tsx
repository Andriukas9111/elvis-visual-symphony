
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import IconSelector from '../../ui/IconSelector';
import ColorInput from './ColorInput';
import { StatCardProps, SocialStat } from './types';

const StatCard: React.FC<StatCardProps> = ({ 
  stat, 
  index, 
  updateStat, 
  removeStat 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={stat.title}
              onChange={(e) => updateStat(index, 'title', e.target.value)}
              placeholder="e.g., Projects Completed"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Value</Label>
            <Input
              value={stat.value}
              onChange={(e) => updateStat(index, 'value', e.target.value)}
              placeholder="e.g., 100+"
            />
          </div>
          
          <ColorInput
            label="Background Color"
            value={stat.background_color || '#1A1A1A'}
            onChange={(value) => updateStat(index, 'background_color', value)}
            placeholder="#1A1A1A"
          />
          
          <ColorInput
            label="Text Color"
            value={stat.text_color || '#FFFFFF'}
            onChange={(value) => updateStat(index, 'text_color', value)}
            placeholder="#FFFFFF"
          />
          
          <div className="md:col-span-2">
            <Label className="text-sm font-medium">Icon</Label>
            <IconSelector
              value={stat.icon || ''}
              onChange={(value) => updateStat(index, 'icon', value)}
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeStat(index)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
