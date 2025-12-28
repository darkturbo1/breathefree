import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wind, ArrowRight, Skull, AlertTriangle, Heart, Brain, Baby, Clock } from 'lucide-react';

interface ScaryStatsProps {
  onContinue: () => void;
}

const scaryStats = [
  {
    icon: <Skull className="w-8 h-8" />,
    stat: '8 Million',
    label: 'Deaths per year',
    description: 'Smoking kills more than 8 million people annually worldwide',
    color: 'danger',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    stat: '11 Minutes',
    label: 'Lost per cigarette',
    description: 'Every single cigarette shortens your life by 11 minutes',
    color: 'warning',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    stat: '2x Higher',
    label: 'Heart attack risk',
    description: 'Smokers are twice as likely to have a heart attack',
    color: 'danger',
  },
  {
    icon: <Brain className="w-8 h-8" />,
    stat: '70%',
    label: 'Stroke risk increase',
    description: 'Smoking increases your risk of stroke by 70%',
    color: 'warning',
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    stat: '90%',
    label: 'Lung cancer cases',
    description: '90% of lung cancer cases are caused by smoking',
    color: 'danger',
  },
  {
    icon: <Baby className="w-8 h-8" />,
    stat: '4,000+',
    label: 'Toxic chemicals',
    description: 'Each cigarette contains over 4,000 toxic chemicals',
    color: 'warning',
  },
];

const ScaryStats: React.FC<ScaryStatsProps> = ({ onContinue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (currentIndex < scaryStats.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onContinue();
    }
  };

  const current = scaryStats[currentIndex];
  const progress = ((currentIndex + 1) / scaryStats.length) * 100;

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-6 relative z-10">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Wind className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">The Truth About Smoking</h1>
        <p className="text-muted-foreground mt-2">Facts you need to know</p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Fact {currentIndex + 1} of {scaryStats.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-danger to-warning rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stat Card */}
      <div
        className={`glass-panel-strong w-full max-w-md p-8 text-center transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${current.color === 'danger' ? 'border-danger/30' : 'border-warning/30'}`}
      >
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            current.color === 'danger' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
          } animate-heartbeat`}
        >
          {current.icon}
        </div>

        <div
          className={`text-5xl font-bold mb-2 ${
            current.color === 'danger' ? 'text-danger' : 'text-warning'
          }`}
        >
          {current.stat}
        </div>
        <div className="text-xl font-semibold mb-4">{current.label}</div>
        <p className="text-muted-foreground leading-relaxed">{current.description}</p>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-8 mb-6">
        {scaryStats.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(i);
                setIsAnimating(false);
              }, 200);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 tap-scale ${
              i === currentIndex
                ? 'bg-primary w-8'
                : i < currentIndex
                ? 'bg-primary/50'
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* CTA Button */}
      <Button
        variant={currentIndex === scaryStats.length - 1 ? 'primary' : 'glass'}
        size="lg"
        onClick={handleNext}
        className="w-full max-w-md"
      >
        {currentIndex === scaryStats.length - 1 ? (
          <>
            I'm Ready to Quit
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        ) : (
          'Next Fact'
        )}
      </Button>

      {/* Skip */}
      {currentIndex < scaryStats.length - 1 && (
        <button
          onClick={onContinue}
          className="mt-4 text-muted-foreground text-sm hover:text-foreground transition-colors tap-scale"
        >
          Skip to questionnaire
        </button>
      )}
    </div>
  );
};

export default ScaryStats;
