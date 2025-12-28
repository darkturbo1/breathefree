import React, { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useStats } from '@/hooks/useStats';
import AuthPage from '@/components/auth/AuthPage';
import ScaryStats from '@/components/onboarding/ScaryStats';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import Dashboard from '@/components/dashboard/Dashboard';
import { Loader2, Wind } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppStep = 'loading' | 'auth' | 'scary-stats' | 'questionnaire' | 'dashboard';

const Index: React.FC = () => {
  const { userData, saveUserData, clearUserData, resetProgram, isLoading: isDataLoading } = useUserData();
  const stats = useStats(userData);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [step, setStep] = useState<AppStep>('loading');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine current step
  useEffect(() => {
    if (isAuthLoading || isDataLoading) {
      setStep('loading');
    } else if (!user) {
      setStep('auth');
    } else if (userData && stats) {
      setStep('dashboard');
    } else {
      // User is logged in but no data - check if they've seen scary stats
      const hasSeenStats = localStorage.getItem('breathe-free-seen-stats');
      if (hasSeenStats) {
        setStep('questionnaire');
      } else {
        setStep('scary-stats');
      }
    }
  }, [isAuthLoading, isDataLoading, user, userData, stats]);

  const handleAuthSuccess = () => {
    // Auth state change will update the user state
  };

  const handleScaryStatsComplete = () => {
    localStorage.setItem('breathe-free-seen-stats', 'true');
    setStep('questionnaire');
  };

  const handleReset = () => {
    clearUserData();
    localStorage.removeItem('breathe-free-seen-stats');
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative z-10">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Wind className="w-10 h-10 text-primary" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (step === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (step === 'scary-stats') {
    return <ScaryStats onContinue={handleScaryStatsComplete} />;
  }

  if (step === 'questionnaire') {
    return <OnboardingFlow onComplete={saveUserData} />;
  }

  if (step === 'dashboard' && userData && stats) {
    return (
      <Dashboard 
        userData={userData} 
        stats={stats} 
        onReset={handleReset} 
        onResetProgram={resetProgram} 
        onUpdateUserData={saveUserData}
      />
    );
  }

  return null;
};

export default Index;
