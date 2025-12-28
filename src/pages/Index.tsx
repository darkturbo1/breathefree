import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useStats } from '@/hooks/useStats';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import Dashboard from '@/components/dashboard/Dashboard';
import { Loader2, Wind } from 'lucide-react';

const Index: React.FC = () => {
  const { userData, saveUserData, clearUserData, isLoading } = useUserData();
  const stats = useStats(userData);

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Wind className="w-8 h-8 text-primary" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (!userData || !stats) {
    return <OnboardingFlow onComplete={saveUserData} />;
  }

  return <Dashboard userData={userData} stats={stats} onReset={clearUserData} />;
};

export default Index;
