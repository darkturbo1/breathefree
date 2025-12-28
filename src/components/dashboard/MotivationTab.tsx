import React, { useState } from 'react';
import { Stats } from '@/types/smoking';
import { formatMoney, formatLifetime } from '@/lib/statsCalculator';
import { Sparkles, RefreshCw, Heart, Wallet, Clock, Cigarette, Crown, Lock, BookOpen, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MotivationTabProps {
  stats: Stats;
}

const motivationalQuotes = [
  { text: "Every cigarette not smoked is a victory.", author: "You" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Your lungs are healing with every breath you take.", author: "Medical fact" },
  { text: "You're not giving something up—you're gaining freedom.", author: "Allen Carr" },
  { text: "The pain you feel today is the strength you feel tomorrow.", author: "Unknown" },
  { text: "Cravings pass. Your health is worth the wait.", author: "Truth" },
  { text: "You didn't come this far to only come this far.", author: "Unknown" },
  { text: "The first step towards getting somewhere is to decide you're not going to stay where you are.", author: "J.P. Morgan" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const proTips = [
  { title: "Deep Breathing Exercise", description: "4-7-8 technique: Inhale 4s, hold 7s, exhale 8s", icon: "🧘" },
  { title: "Craving Crusher", description: "Drink cold water slowly when cravings hit", icon: "💧" },
  { title: "Movement Break", description: "10 jumping jacks can reduce craving intensity by 50%", icon: "🏃" },
  { title: "Mindful Moment", description: "Name 5 things you can see right now", icon: "👁️" },
  { title: "Reward Reminder", description: "Calculate what you'll buy with saved money", icon: "🎁" },
];

const MotivationTab: React.FC<MotivationTabProps> = ({ stats }) => {
  const [quoteIndex, setQuoteIndex] = useState(() => 
    Math.floor(Math.random() * motivationalQuotes.length)
  );
  const [showProModal, setShowProModal] = useState(false);
  const { subscribed, startCheckout } = useSubscription();

  const quote = motivationalQuotes[quoteIndex];

  const shuffleQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (newIndex === quoteIndex && motivationalQuotes.length > 1);
    setQuoteIndex(newIndex);
  };

  const handleUpgrade = async () => {
    try {
      await startCheckout();
      setShowProModal(false);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const reasonsToQuit = [
    {
      icon: Heart,
      title: "Better Health",
      description: "Your heart rate and blood pressure are already improving",
      color: "text-destructive",
    },
    {
      icon: Wallet,
      title: "Money Saved",
      description: `You've saved ${formatMoney(stats.moneySaved)} so far!`,
      color: "text-success",
    },
    {
      icon: Clock,
      title: "Time Regained",
      description: `You've added ${formatLifetime(stats.lifetimeRegained)} to your life`,
      color: "text-warning",
    },
    {
      icon: Cigarette,
      title: "Cigarettes Avoided",
      description: `${stats.cigarettesNotSmoked.toLocaleString()} cigarettes not smoked`,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quote Card */}
      <div className="glass-panel-strong p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <div className="flex items-start justify-between mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <Button
            variant="ghost"
            size="icon"
            onClick={shuffleQuote}
            className="tap-scale -mt-1 -mr-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <blockquote className="text-lg font-medium mb-3 leading-relaxed">
          "{quote.text}"
        </blockquote>
        <cite className="text-sm text-muted-foreground not-italic">
          — {quote.author}
        </cite>
      </div>

      {/* Pro Tips Section */}
      {subscribed ? (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Pro Tips & Techniques
          </h2>
          <div className="space-y-3">
            {proTips.map((tip, index) => (
              <div
                key={tip.title}
                className="glass-panel p-4 flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="glass-panel-strong p-6 cursor-pointer tap-scale border-amber-500/30"
          onClick={() => setShowProModal(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Pro Tips & Techniques
            </h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20">
              <Crown className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-500 font-medium">PRO</span>
            </div>
          </div>
          <div className="space-y-2 opacity-50 blur-[2px]">
            {proTips.slice(0, 2).map((tip) => (
              <div key={tip.title} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                <span className="text-lg">{tip.icon}</span>
                <span className="text-sm">{tip.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Unlock 5 Pro Tips</span>
          </div>
        </div>
      )}

      {/* Why You Quit */}
      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">💪</span> Why You're Winning
        </h2>
        <div className="grid gap-3">
          {reasonsToQuit.map((reason, index) => (
            <div
              key={reason.title}
              className="glass-panel p-4 flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`p-2 rounded-xl bg-card ${reason.color}`}>
                <reason.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Resources (locked for free users) */}
      {!subscribed && (
        <div 
          className="glass-panel-strong p-6 cursor-pointer tap-scale border-amber-500/30"
          onClick={() => setShowProModal(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Quit Smoking Guides
            </h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20">
              <Crown className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-500 font-medium">PRO</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 opacity-50 blur-[2px]">
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-sm">Week 1 Guide</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-sm">Craving Strategies</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Unlock with Pro</span>
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="glass-panel-strong p-6 text-center">
        <div className="text-4xl mb-3">🌟</div>
        <h3 className="font-semibold text-lg mb-2">Keep Going!</h3>
        <p className="text-muted-foreground text-sm">
          Every moment smoke-free is a gift to yourself and your loved ones.
          You're doing amazing!
        </p>
      </div>

      {/* Pro Modal */}
      <Dialog open={showProModal} onOpenChange={setShowProModal}>
        <DialogContent className="glass-panel-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-amber-500" />
              Unlock Pro Motivation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Get expert tips, guides, and AI coaching to stay motivated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>5 Expert Craving Techniques</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span>Step-by-Step Quit Guides</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span>Personalized Goal Setting</span>
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

export default MotivationTab;
