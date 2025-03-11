
import React from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

const ProjectTypesGrid = () => {
  const { data: projects, isLoading } = useExpertise();
  
  // Filter to get only project types
  const projectTypes = projects?.filter(item => item.type === 'project');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-card/30 animate-pulse h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectTypes?.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-card/30 hover-scale h-full transition-all duration-300 hover:bg-card/50">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center">
                  <Icon name={item.icon_name} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{item.label}</h3>
              </div>
              <p className="text-muted-foreground text-sm flex-grow">{item.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectTypesGrid;
