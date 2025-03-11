
import React from 'react';
import { motion } from 'framer-motion';
import { SocialProfile } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';

interface SocialProfileCardProps {
  profile: SocialProfile;
  index: number;
}

const SocialProfileCard: React.FC<SocialProfileCardProps> = ({ profile, index }) => {
  const Icon = getDynamicIcon(profile.icon_name);
  
  // Get platform-specific styling
  const getPlatformColor = () => {
    return {
      Instagram: 'from-pink-600 to-purple-600',
      YouTube: 'from-red-600 to-red-700',
      Twitter: 'from-blue-400 to-blue-600',
      Facebook: 'from-blue-600 to-blue-700',
      LinkedIn: 'from-blue-600 to-cyan-700',
      TikTok: 'from-gray-900 to-gray-800',
      Behance: 'from-blue-600 to-blue-700',
      Pinterest: 'from-red-600 to-red-700',
      Vimeo: 'from-cyan-600 to-cyan-700',
      Website: 'from-gray-600 to-gray-700',
    }[profile.platform] || 'from-gray-600 to-gray-700';
  };
  
  return (
    <motion.a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="bg-elvis-dark/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-full flex items-center gap-3 group-hover:border-elvis-pink/20 transition-colors">
        <div className={`bg-gradient-to-br ${getPlatformColor()} p-3 rounded-full`}>
          <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
        </div>
        
        <div>
          <h4 className="font-medium text-white group-hover:text-elvis-pink transition-colors">{profile.platform}</h4>
          <p className="text-white/50 text-sm">@{profile.username}</p>
          {profile.follower_count && (
            <p className="text-white/70 text-xs mt-1">
              {profile.follower_count >= 1000
                ? `${(profile.follower_count / 1000).toFixed(1)}K followers`
                : `${profile.follower_count} followers`}
            </p>
          )}
        </div>
      </div>
    </motion.a>
  );
};

export default SocialProfileCard;
