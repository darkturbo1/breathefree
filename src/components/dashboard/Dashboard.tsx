import React, { useState } from 'react';
import { UserData, Stats } from '@/types/smoking';
import { formatTime, formatMoney, formatLifetime } from '@/lib/statsCalculator';
import { calculateMilestones } from '@/lib/healthMilestones';
import StatCard from './StatCard';
import MilestoneCard from './MilestoneCard';
import ChatBot from '../chat/ChatBot';
import { Wind, Clock, Cigarette, Wallet, Heart, Trophy, MessageCircle, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  userData: UserData;
  stats: Stats;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, stats, onReset }) => {
  const [showChat, setShowChat] = useState(false);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  const hoursSinceQuit =
    stats.timeSinceQuit.days * 24 +
    stats.timeSinceQuit.hours +
    stats.timeSinceQuit.minutes / 60;

  const milestones = calculateMilestones(hoursSinceQuit);
  const achievedCount = milestones.filter((m) => m.achieved).length;

  const displayMilestones = showAllMilestones
    ? milestones
    : milestones.filter((m) => !m.achieved).slice(0, 3);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold gradient-text">BreatheFree</h1>
              <p className="text-xs text-muted-foreground">Stay strong!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Hero Timer */}
        <div className="glass-panel p-6 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-2">Smoke-free for</p>
          <div className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {formatTime(stats.timeSinceQuit)}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Since{' '}
              {new Date(userData.quitDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Cigarette className="w-5 h-5" />}
            label="Not Smoked"
            value={stats.cigarettesNotSmoked.toLocaleString()}
            subvalue="cigarettes"
            color="success"
            className="animate-fade-in-delay-1"
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Money Saved"
            value={formatMoney(stats.moneySaved)}
            subvalue="so far"
            color="primary"
            className="animate-fade-in-delay-2"
          />
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            label="Life Regained"
            value={formatLifetime(stats.lifetimeRegained)}
            subvalue="added to your life"
            color="warning"
            className="animate-fade-in-delay-3"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Achievements"
            value={`${achievedCount}/${milestones.length}`}
            subvalue="milestones reached"
            className="animate-fade-in-delay-3"
          />
        </div>

        {/* Current Milestone */}
        {stats.nextMilestone && (
          <div className="animate-fade-in">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span> Next Goal
            </h2>
            <MilestoneCard milestone={stats.nextMilestone} isNext />
          </div>
        )}

        {/* Health Milestones */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-lg">🏆</span> Health Milestones
            </h2>
            <button
              onClick={() => setShowAllMilestones(!showAllMilestones)}
              className="text-sm text-primary flex items-center gap-1"
            >
              {showAllMilestones ? 'Show less' : 'View all'}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAllMilestones ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
          <div className="space-y-3">
            {displayMilestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>
      </main>

      {/* Chat FAB */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Dashboard;
