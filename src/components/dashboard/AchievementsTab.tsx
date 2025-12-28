import React, { useState } from 'react';
import { calculateMilestones } from '@/lib/healthMilestones';
import MilestoneCard from './MilestoneCard';
import { Trophy, CheckCircle2, Clock, Lock, Crown, TrendingUp, Calendar, Target } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AchievementsTabProps {
  hoursSinceQuit: number;
}

const FREE_MILESTONE_LIMIT = 5;

const AchievementsTab: React.FC<AchievementsTabProps> = ({ hoursSinceQuit }) => {
  const milestones = calculateMilestones(hoursSinceQuit);
  const achieved = milestones.filter((m) => m.achieved);
  const upcoming = milestones.filter((m) => !m.achieved);
  const { subscribed, startCheckout } = useSubscription();
  const [showProModal, setShowProModal] = useState(false);

  // Split milestones into free and locked
  const freeAchieved = achieved.slice(0, FREE_MILESTONE_LIMIT);
  const lockedAchieved = achieved.slice(FREE_MILESTONE_LIMIT);
  const freeUpcoming = upcoming.slice(0, Math.max(0, FREE_MILESTONE_LIMIT - achieved.length));
  const lockedUpcoming = upcoming.slice(Math.max(0, FREE_MILESTONE_LIMIT - achieved.length));

  const handleUpgrade = async () => {
    try {
      await startCheckout();
      setShowProModal(false);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const LockedMilestoneCard = ({ milestone }: { milestone: typeof milestones[0] }) => (
    <div
      className="glass-panel p-6 relative overflow-hidden opacity-60 cursor-pointer tap-scale"
      onClick={() => setShowProModal(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
          <Lock className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-500">Pro Only</span>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-secondary blur-[2px]">
          {milestone.icon}
        </div>
        <div className="flex-1 min-w-0 blur-[2px]">
          <h3 className="font-semibold mb-1 truncate">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground">Unlock with Pro to see details</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Card */}
      <div className="glass-panel-strong p-6 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold gradient-text mb-2">
          {achieved.length} / {milestones.length}
        </h2>
        <p className="text-muted-foreground">Milestones Achieved</p>
        {!subscribed && achieved.length > FREE_MILESTONE_LIMIT && (
          <p className="text-xs text-amber-500 mt-2 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            {achieved.length - FREE_MILESTONE_LIMIT} locked achievements
          </p>
        )}
      </div>

      {/* Pro Analytics Preview */}
      {!subscribed && (
        <div 
          className="glass-panel-strong p-6 cursor-pointer tap-scale border-amber-500/30"
          onClick={() => setShowProModal(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Detailed Analytics
            </h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20">
              <Crown className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-500 font-medium">PRO</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 opacity-50 blur-[2px]">
            <div className="bg-secondary rounded-xl p-3 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Weekly</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-xs text-muted-foreground">Trends</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-warning" />
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Unlock with Pro</span>
          </div>
        </div>
      )}

      {/* Pro Analytics (for subscribers) */}
      {subscribed && (
        <div className="glass-panel-strong p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Progress Analytics
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{Math.floor(hoursSinceQuit / 24)}</p>
              <p className="text-xs text-muted-foreground">Days Strong</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-success">{achieved.length}</p>
              <p className="text-xs text-muted-foreground">Wins Unlocked</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-warning">{upcoming[0]?.progress.toFixed(0) || 100}%</p>
              <p className="text-xs text-muted-foreground">Next Goal</p>
            </div>
          </div>
        </div>
      )}

      {/* Achieved Section */}
      {achieved.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Unlocked ({achieved.length})
          </h2>
          <div className="space-y-3">
            {(subscribed ? achieved : freeAchieved).map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
            {!subscribed && lockedAchieved.map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${(freeAchieved.length + index) * 50}ms` }}
                className="animate-fade-in"
              >
                <LockedMilestoneCard milestone={milestone} />
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
            {(subscribed ? upcoming : freeUpcoming).map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
            {!subscribed && lockedUpcoming.map((milestone, index) => (
              <div
                key={milestone.id}
                style={{ animationDelay: `${(freeUpcoming.length + index) * 50}ms` }}
                className="animate-fade-in"
              >
                <LockedMilestoneCard milestone={milestone} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade CTA for free users */}
      {!subscribed && (
        <div className="glass-panel-strong p-6 text-center border-amber-500/30">
          <Crown className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Unlock All {milestones.length} Milestones</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get detailed analytics, all achievements, and AI coaching support.
          </p>
          <Button onClick={handleUpgrade} className="w-full">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro - $3/month
          </Button>
        </div>
      )}

      {/* Pro Modal */}
      <Dialog open={showProModal} onOpenChange={setShowProModal}>
        <DialogContent className="glass-panel-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-amber-500" />
              Unlock Pro Features
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Get full access to all milestones and detailed analytics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <span>All {milestones.length} Health Milestones</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span>Detailed Progress Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span>Custom Goal Tracking</span>
              </div>
            </div>
            <div className="text-center py-2">
              <span className="text-3xl font-bold">$3</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button onClick={handleUpgrade} className="w-full" size="lg">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsTab;
