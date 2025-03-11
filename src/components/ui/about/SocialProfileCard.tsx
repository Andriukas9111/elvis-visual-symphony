
import React from 'react';
import { motion } from 'framer-motion';
import { SocialProfile } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';
import { ExternalLink } from 'lucide-react';

interface SocialProfileCardProps {
  profile: SocialProfile;
  index: number;
}

const SocialProfileCard: React.FC<SocialProfileCardProps> = ({ profile, index }) => {
  const Icon = getDynamicIcon(profile.icon_name);
  
  return (
    <motion.a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border border-elvis-medium/20 shadow-md flex flex-col items-center justify-center text-center h-full"
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="bg-elvis-medium/30 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-lg font-medium text-white mb-1">{profile.platform}</h3>
      <p className="text-sm text-white/70 mb-3">@{profile.username}</p>
      
      {profile.follower_count && (
        <p className="text-sm font-medium text-white/90 mb-2">
          {profile.follower_count.toLocaleString()} followers
        </p>
      )}
      
      <div className="flex items-center justify-center text-elvis-pink text-sm">
        <span className="mr-1">Visit</span>
        <ExternalLink className="h-3 w-3" />
      </div>
    </motion.a>
  );
};

export default SocialProfileCard;
