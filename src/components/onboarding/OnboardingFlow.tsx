import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/smoking';
import { Wind, ArrowRight, ArrowLeft, Cigarette, Calendar, Wallet, Package, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: UserData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    cigarettesPerDay: 10,
    yearsSmoked: 5,
    pricePerPack: 8,
    cigarettesPerPack: 20,
  });

  const steps = [
    {
      icon: <Cigarette className="w-8 h-8" />,
      title: 'Cigarettes per day',
      description: 'How many cigarettes do you smoke daily?',
      field: 'cigarettesPerDay',
      min: 1,
      max: 100,
      unit: 'cigarettes',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Years smoking',
      description: 'How long have you been smoking?',
      field: 'yearsSmoked',
      min: 0,
      max: 60,
      unit: 'years',
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Cigarettes per pack',
      description: 'How many cigarettes are in your pack?',
      field: 'cigarettesPerPack',
      min: 10,
      max: 30,
      unit: 'cigarettes',
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Price per pack',
      description: 'How much does a pack cost?',
      field: 'pricePerPack',
      min: 1,
      max: 30,
      unit: '€',
    },
  ];

  const currentStep = steps[step];

  const animateTransition = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      animateTransition(() => setStep(step + 1));
    } else {
      onComplete({
        ...formData,
        quitDate: new Date(),
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      animateTransition(() => setStep(step - 1));
    }
  };

  const updateValue = (delta: number) => {
    const field = currentStep.field as keyof typeof formData;
    const newValue = Math.max(
      currentStep.min,
      Math.min(currentStep.max, formData[field] + delta)
    );
    setFormData({ ...formData, [field]: newValue });
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-6 pb-24 relative z-10">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-float">
          <Wind className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">BreatheFree</h1>
        <p className="text-muted-foreground">Let's personalize your journey</p>
      </div>

      {/* Progress */}
      <div className="flex gap-3 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-primary w-12' : 'bg-primary/20 w-8'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className={`glass-panel-strong w-full max-w-md p-8 transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-6 text-primary">
          {currentStep.icon}
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          {currentStep.title}
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          {currentStep.description}
        </p>

        {/* Value Selector */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={() => updateValue(-1)}
            className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-3xl font-light tap-scale"
          >
            −
          </button>
          <div className="text-center min-w-[100px]">
            <span className="text-6xl font-bold gradient-text tabular-nums">
              {formData[currentStep.field as keyof typeof formData]}
            </span>
            <p className="text-muted-foreground text-sm mt-2">
              {currentStep.unit}
            </p>
          </div>
          <button
            onClick={() => updateValue(1)}
            className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-3xl font-light tap-scale"
          >
            +
          </button>
        </div>

        {/* Slider */}
        <div className="relative mb-8">
          <input
            type="range"
            min={currentStep.min}
            max={currentStep.max}
            value={formData[currentStep.field as keyof typeof formData]}
            onChange={(e) =>
              setFormData({
                ...formData,
                [currentStep.field]: Number(e.target.value),
              })
            }
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{currentStep.min}</span>
            <span>{currentStep.max}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {step > 0 && (
            <Button
              variant="glass"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex-1"
          >
            {step === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Start My Journey
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground text-sm mt-8 text-center max-w-xs animate-fade-in">
        Your data stays private and secure on your device
      </p>
    </div>
  );
};

export default OnboardingFlow;
