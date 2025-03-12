
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Film, 
  Loader2, 
  Upload, 
  RefreshCw 
} from 'lucide-react';

interface ActionButtonsProps {
  isGenerating: boolean;
  thumbnailsExist: boolean;
  hasVideoSource: boolean;
  onGenerate: () => void;
  onUploadClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isGenerating,
  thumbnailsExist,
  hasVideoSource,
  onGenerate,
  onUploadClick
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/10 hover:bg-elvis-pink/20"
        disabled={isGenerating || !hasVideoSource}
        onClick={onGenerate}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Generating...
          </>
        ) : thumbnailsExist ? (
          <>
            <RefreshCw className="mr-2 h-3 w-3" />
            Regenerate
          </>
        ) : (
          <>
            <Film className="mr-2 h-3 w-3" />
            Generate from Video
          </>
        )}
      </Button>
      
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/10 hover:bg-elvis-pink/20"
        onClick={onUploadClick}
      >
        <Upload className="mr-2 h-3 w-3" />
        Upload Custom
      </Button>
    </div>
  );
};

export default ActionButtons;
