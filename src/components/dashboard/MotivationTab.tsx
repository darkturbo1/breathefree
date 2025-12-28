import React, { useState } from 'react';
import { Stats } from '@/types/smoking';
import { formatMoney, formatLifetime } from '@/lib/statsCalculator';
import { Sparkles, RefreshCw, Heart, Wallet, Clock, Cigarette } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const MotivationTab: React.FC<MotivationTabProps> = ({ stats }) => {
  const [quoteIndex, setQuoteIndex] = useState(() => 
    Math.floor(Math.random() * motivationalQuotes.length)
  );

  const quote = motivationalQuotes[quoteIndex];

  const shuffleQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (newIndex === quoteIndex && motivationalQuotes.length > 1);
    setQuoteIndex(newIndex);
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

      {/* Encouragement */}
      <div className="glass-panel-strong p-6 text-center">
        <div className="text-4xl mb-3">🌟</div>
        <h3 className="font-semibold text-lg mb-2">Keep Going!</h3>
        <p className="text-muted-foreground text-sm">
          Every moment smoke-free is a gift to yourself and your loved ones.
          You're doing amazing!
        </p>
      </div>
    </div>
  );
};

export default MotivationTab;
