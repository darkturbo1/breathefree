import { useState, useEffect, useCallback } from 'react';
import { UserData } from '@/types/smoking';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'breathe-free-user-data';

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from database
  const fetchFromDatabase = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
      }

      if (data) {
        const userData: UserData = {
          cigarettesPerDay: data.cigarettes_per_day,
          yearsSmoked: data.years_smoked,
          pricePerPack: Number(data.price_per_pack),
          cigarettesPerPack: data.cigarettes_per_pack,
          quitDate: new Date(data.quit_date),
        };
        return userData;
      }
      return null;
    } catch (e) {
      console.error('Failed to fetch user data from database:', e);
      return null;
    }
  }, []);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to fetch from database first
        const dbData = await fetchFromDatabase(user.id);
        if (dbData) {
          setUserData(dbData);
          // Also store in localStorage for offline access
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData));
          setIsLoading(false);
          return;
        }
      }

      // Fallback to localStorage
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
    };

    loadUserData();
  }, [fetchFromDatabase]);

  const saveUserData = async (data: UserData) => {
    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data);

    // Try to save to database if authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            cigarettes_per_day: data.cigarettesPerDay,
            years_smoked: data.yearsSmoked,
            price_per_pack: data.pricePerPack,
            cigarettes_per_pack: data.cigarettesPerPack,
            quit_date: data.quitDate.toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving user preferences:', error);
        }
      }
    } catch (e) {
      console.error('Failed to save user data to database:', e);
    }
  };

  const clearUserData = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);

    // Try to delete from database if authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (e) {
      console.error('Failed to delete user data from database:', e);
    }
  };

  return { userData, saveUserData, clearUserData, isLoading };
}