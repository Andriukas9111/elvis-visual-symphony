
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeyAccomplishmentsProps {
  isInView: boolean;
}

const KeyAccomplishments: React.FC<KeyAccomplishmentsProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();
  const [activeTab, setActiveTab] = useState("projects");

  // Filter accomplishment stats
  const accomplishmentStats = stats?.filter(
    stat => !['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];

  // Default stats in case database is empty
  const defaultStats = [
    { id: '1', icon_name: 'CheckCircle', value: 300, suffix: '+', label: 'Projects Completed', tab: 'projects' },
    { id: '2', icon_name: 'Video', value: 5, suffix: 'M+', label: 'Video Views', tab: 'views' },
    { id: '3', icon_name: 'Calendar', value: 8, suffix: '+', label: 'Years Experience', tab: 'experience' },
    { id: '4', icon_name: 'Trophy', value: 20, suffix: '+', label: 'Awards Won', tab: 'awards' },
    { id: '5', icon_name: 'Star', value: 96, suffix: '%', label: 'Client Satisfaction', tab: 'satisfaction' }
  ];

  const displayStats = accomplishmentStats.length > 0 ? accomplishmentStats : defaultStats;

  // Ensure all stats have tab property
  const processedStats = displayStats.map((stat, index) => ({
    ...stat,
    tab: stat.tab || `tab-${index}`
  }));

  const bgColors = [
    'from-purple-900 to-purple-800',
    'from-blue-900 to-blue-800',
    'from-green-900 to-green-800',
    'from-amber-900 to-amber-800',
    'from-rose-900 to-rose-800'
  ];

  const tabContent = {
    projects: "Over 300 successful projects delivered to satisfied clients worldwide.",
    views: "More than 5 million views across various social media platforms.",
    experience: "8+ years of professional experience in videography and photography.",
    awards: "Recognized with 20+ industry awards for excellence in videography.",
    satisfaction: "96% client satisfaction rate with consistent 5-star reviews."
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Key Accomplishments
      </h3>
      
      <Tabs defaultValue={processedStats[0]?.tab || "projects"} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-elvis-dark">
          {processedStats.map((stat) => (
            <TabsTrigger
              key={stat.id}
              value={stat.tab}
              className="text-sm"
            >
              {stat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {processedStats.map((stat, index) => (
          <TabsContent key={stat.id} value={stat.tab}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${bgColors[index % bgColors.length]} rounded-xl p-8`}
            >
              <div className="flex items-center mb-4">
                <div className="bg-black/20 p-3 rounded-full">
                  {getIconByName(stat.icon_name, "text-white h-6 w-6")}
                </div>
                <h3 className="text-3xl font-bold text-white ml-4">
                  {stat.value}{stat.suffix}
                </h3>
              </div>
              <p className="text-white/80">
                {tabContent[stat.tab as keyof typeof tabContent] || stat.label}
              </p>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KeyAccomplishments;
