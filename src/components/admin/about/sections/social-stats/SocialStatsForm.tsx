
import React from 'react';
import StatCard from './StatCard';
import StatFormActions from './StatFormActions';
import { useSocialStats } from './useSocialStats';

const SocialStatsForm: React.FC = () => {
  const {
    stats,
    isLoading,
    updateMutation,
    addStat,
    removeStat,
    updateStat,
    handleSave
  } = useSocialStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <StatFormActions
        onSave={handleSave}
        addStat={addStat}
        isSubmitting={updateMutation.isPending}
      />

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            index={index}
            updateStat={updateStat}
            removeStat={removeStat}
          />
        ))}
      </div>

      {/* Bottom save button */}
      <div className="flex justify-end">
        <StatFormActions
          onSave={handleSave}
          addStat={addStat}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default SocialStatsForm;
