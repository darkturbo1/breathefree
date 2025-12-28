import React, { useState, useEffect } from 'react';
import { UserData, Stats } from '@/types/smoking';
import { formatTime, formatMoney, formatLifetime } from '@/lib/statsCalculator';
import { calculateMilestones } from '@/lib/healthMilestones';
import StatCard from './StatCard';
import MilestoneCard from './MilestoneCard';
import ChatBot from '../chat/ChatBot';
import BottomNav, { TabType } from './BottomNav';
import JournalTab from './JournalTab';
import AchievementsTab from './AchievementsTab';
import MotivationTab from './MotivationTab';
import SettingsSheet from '../settings/SettingsSheet';
import { Wind, Clock, Cigarette, Wallet, Heart, Trophy, MessageCircle, LogOut, ChevronDown, User, Settings, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DashboardProps {
  userData: UserData;
  stats: Stats;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, stats, onReset }) => {
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();
  const { subscribed, isLoading: subLoading, startCheckout } = useSubscription();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    };
    getUser();
  }, []);

  const hoursSinceQuit =
    stats.timeSinceQuit.days * 24 +
    stats.timeSinceQuit.hours +
    stats.timeSinceQuit.minutes / 60;

  const milestones = calculateMilestones(hoursSinceQuit);
  const achievedCount = milestones.filter((m) => m.achieved).length;

  const displayMilestones = showAllMilestones
    ? milestones
    : milestones.filter((m) => !m.achieved).slice(0, 3);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onReset();
    toast({
      title: "Signed out",
      description: "See you soon! Stay strong 💪",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'journal':
        return <JournalTab />;
      case 'achievements':
        return <AchievementsTab hoursSinceQuit={hoursSinceQuit} />;
      case 'motivation':
        return <MotivationTab stats={stats} />;
      default:
        return (
          <>
            {/* Hero Timer */}
            <div className="glass-panel-strong p-8 text-center animate-fade-in">
              <p className="text-sm text-muted-foreground mb-3">Smoke-free for</p>
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-4 tabular-nums">
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
            <div className="grid grid-cols-2 gap-4 stagger-children">
              <StatCard
                icon={<Cigarette className="w-5 h-5" />}
                label="Not Smoked"
                value={stats.cigarettesNotSmoked.toLocaleString()}
                subvalue="cigarettes"
                color="success"
              />
              <StatCard
                icon={<Wallet className="w-5 h-5" />}
                label="Money Saved"
                value={formatMoney(stats.moneySaved)}
                subvalue="so far"
                color="primary"
              />
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label="Life Regained"
                value={formatLifetime(stats.lifetimeRegained)}
                subvalue="added to your life"
                color="warning"
              />
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="Achievements"
                value={`${achievedCount}/${milestones.length}`}
                subvalue="milestones reached"
              />
            </div>

            {/* Current Milestone */}
            {stats.nextMilestone && (
              <div className="animate-fade-in">
                <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                  <span className="text-xl">🎯</span> Next Goal
                </h2>
                <MilestoneCard milestone={stats.nextMilestone} isNext />
              </div>
            )}

            {/* Health Milestones */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2 text-lg">
                  <span className="text-xl">🏆</span> Health Milestones
                </h2>
                <button
                  onClick={() => setShowAllMilestones(!showAllMilestones)}
                  className="text-sm text-primary flex items-center gap-1 font-medium tap-scale"
                >
                  {showAllMilestones ? 'Show less' : 'View all'}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showAllMilestones ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-4">
                {displayMilestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="animate-fade-in"
                  >
                    <MilestoneCard milestone={milestone} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  const handleChatClick = () => {
    if (subscribed) {
      setShowChat(true);
    } else {
      setShowProModal(true);
    }
  };

  const handleUpgrade = async () => {
    try {
      await startCheckout();
      setShowProModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-background/70 border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold gradient-text text-lg">BreatheFree</h1>
                {subscribed && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 text-xs px-2 py-0.5">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Stay strong!</p>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="tap-scale"
            >
              <User className="w-5 h-5" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 glass-panel-strong p-2 min-w-[160px] animate-fade-in-scale">
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-left hover:bg-secondary transition-colors tap-scale"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-left hover:bg-secondary transition-colors tap-scale"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {renderTabContent()}
      </main>

      {/* Chat FAB */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-40 tap-scale shadow-glow-lg"
        style={{ background: 'var(--gradient-primary)' }}
      >
        {subscribed ? (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
            <Lock className="w-3 h-3 text-primary-foreground absolute -top-1 -right-1" />
          </div>
        )}
      </button>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Pro Upgrade Modal */}
      <Dialog open={showProModal} onOpenChange={setShowProModal}>
        <DialogContent className="glass-panel-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-amber-500" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Unlock the AI Breathe Coach and get personalized support on your quit journey.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <span>24/7 AI Coaching Support</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <span>Personalized Craving Help</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <span>Motivation & Tips</span>
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

      {/* Modals */}
      {showChat && subscribed && <ChatBot onClose={() => setShowChat(false)} />}
      <SettingsSheet open={showSettings} onOpenChange={setShowSettings} userEmail={userEmail} />
    </div>
  );
};

export default Dashboard;
