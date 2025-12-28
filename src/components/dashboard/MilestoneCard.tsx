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
      className={`glass-panel p-6 transition-all duration-500 tap-scale ${
        milestone.achieved
          ? 'border-success/40'
          : isNext
          ? 'border-primary/40 animate-pulse-glow'
          : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
            milestone.achieved
              ? 'bg-success/15'
              : isNext
              ? 'bg-primary/15'
              : 'bg-secondary'
          }`}
        >
          {milestone.icon}
          {milestone.achieved && (
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/30">
              <Check className="w-3.5 h-3.5 text-success-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 truncate">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
          
          {!milestone.achieved && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-semibold">
                  {Math.round(milestone.progress)}%
                </span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${milestone.progress}%`,
                    background: 'var(--gradient-primary)',
                  }}
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
