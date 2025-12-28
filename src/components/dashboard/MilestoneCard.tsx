import React from 'react';
import { HealthMilestone } from '@/types/smoking';
import { Check } from 'lucide-react';

interface MilestoneCardProps {
  milestone: HealthMilestone;
  isNext?: boolean;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, isNext }) => {
  return (
    <div
      className={`glass-panel p-5 transition-all duration-500 ${
        milestone.achieved ? 'border-success/30' : isNext ? 'border-primary/30' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
            milestone.achieved
              ? 'bg-success/10'
              : isNext
              ? 'bg-primary/10'
              : 'bg-secondary'
          }`}
        >
          {milestone.icon}
          {milestone.achieved && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-success-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
          
          {!milestone.achieved && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-medium">
                  {Math.round(milestone.progress)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
