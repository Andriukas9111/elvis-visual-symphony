
import React from 'react';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';
import { useAccomplishments } from '@/hooks/api/useAccomplishments';
import { Accomplishment } from '@/components/home/about/types';

interface KeyAccomplishmentsProps {
  isInView?: boolean; // Make isInView optional to avoid the error
}

const KeyAccomplishments: React.FC<KeyAccomplishmentsProps> = ({ isInView }) => {
  const { data: accomplishments, isLoading, error } = useAccomplishments();
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-300/20 dark:bg-gray-700/20 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-200/20 dark:bg-gray-800/20 rounded"></div>
          <div className="h-24 bg-gray-200/20 dark:bg-gray-800/20 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !accomplishments || accomplishments.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-8 mt-10">
      <h3 className="text-2xl font-bold">Key Accomplishments</h3>
      
      <div className="space-y-6">
        {accomplishments.map((item: Accomplishment) => (
          <div key={item.id} className="flex gap-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
              {React.createElement(getIconByName(item.icon_name || 'Award'), { className: "h-6 w-6 text-primary" })}
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                {item.title}
                <span className="text-sm font-normal text-muted-foreground">
                  {item.date}
                </span>
              </h4>
              
              <p className="text-muted-foreground">{item.description}</p>
              
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1.5 text-sm font-medium mt-1"
                >
                  {item.url_text || 'Learn more'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyAccomplishments;
