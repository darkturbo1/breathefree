import React from 'react';
import { calculateMilestones } from '@/lib/healthMilestones';
import MilestoneCard from './MilestoneCard';
import { Trophy, CheckCircle2, Clock } from 'lucide-react';

interface AchievementsTabProps {
  hoursSinceQuit: number;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ hoursSinceQuit }) => {
  const milestones = calculateMilestones(hoursSinceQuit);
  const achieved = milestones.filter((m) => m.achieved);
  const upcoming = milestones.filter((m) => !m.achieved);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Card */}
      <div className="glass-panel-strong p-6 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold gradient-text mb-2">
          {achieved.length} / {milestones.length}
        </h2>
        <p className="text-muted-foreground">Milestones Achieved</p>
      </div>

      {/* Achieved Section */}
      {achieved.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Unlocked ({achieved.length})
          </h2>
          <div className="space-y-3">
            {achieved.map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Coming Up ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;
