
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTechnicalSkills } from '@/hooks/api/useTechnicalSkills';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@/components/ui/icon';

const TechnicalSkillsGrid = () => {
  const { data: skills, isLoading } = useTechnicalSkills();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={ref}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-card/30 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={ref}>
      {skills?.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { 
              opacity: 1,
              transition: { duration: 0.3, delay: index * 0.1 }
            }
          }}
        >
          <Card className="bg-card/30 hover:bg-card/50 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full w-8 h-8 bg-primary/20 flex items-center justify-center">
                    <Icon name={skill.icon} className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-medium">{skill.name}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Progress value={skill.level} className="h-2" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TechnicalSkillsGrid;
