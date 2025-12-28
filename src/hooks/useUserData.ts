import { useState, useEffect } from 'react';
import { UserData } from '@/types/smoking';

const STORAGE_KEY = 'breathe-free-user-data';

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.quitDate = new Date(parsed.quitDate);
        setUserData(parsed);
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUserData = (data: UserData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data);
  };

  const clearUserData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
  };

  return { userData, saveUserData, clearUserData, isLoading };
}
