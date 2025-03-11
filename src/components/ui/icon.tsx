
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  
  return <IconComponent {...props} />;
};
