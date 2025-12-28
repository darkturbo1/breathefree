import { useState, useEffect } from 'react';
import { UserData, Stats } from '@/types/smoking';
import { calculateStats } from '@/lib/statsCalculator';

export function useStats(userData: UserData | null) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!userData) {
      setStats(null);
      return;
    }

    // Calculate immediately
    setStats(calculateStats(userData));

    // Update every second for real-time feel
    const interval = setInterval(() => {
      setStats(calculateStats(userData));
    }, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  return stats;
}
