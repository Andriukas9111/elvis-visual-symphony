
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ExpertiseItem } from '@/hooks/api/useExpertise';
import { getIconByName } from '../stats/IconSelector';

interface ProjectsListProps {
  projects: ExpertiseItem[];
  isLoading: boolean;
  error: any;
  onEdit: (item: ExpertiseItem) => void;
  onDelete: (id: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  isLoading, 
  error, 
  onEdit, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="p-4">
              <div className="h-6 bg-secondary/50 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-16 bg-secondary/30 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading project data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center py-12">
          <p className="text-muted-foreground">No project types found. Add your first project type.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((item) => {
        const IconComponent = getIconByName(item.icon_name);
        
        return (
          <Card key={item.id} className="border border-border">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded">
                  {IconComponent}
                </div>
                <CardTitle className="text-lg">{item.label}</CardTitle>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-2 px-4 pb-4">
              <p className="text-muted-foreground text-sm">
                {item.description.length > 150 
                  ? `${item.description.substring(0, 150)}...` 
                  : item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectsList;
