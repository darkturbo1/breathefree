import { useState, useEffect, useCallback } from 'react';
import { UserData } from '@/types/smoking';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'breathe-free-user-data';

type UserPreferencesRow = {
  user_id: string;
  cigarettes_per_day: number;
  years_smoked: number;
  price_per_pack: number | string;
  cigarettes_per_pack: number;
  quit_date: string;
  currency?: string;
};

const readLocalUserData = (): UserData | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    parsed.quitDate = new Date(parsed.quitDate);
    return parsed as UserData;
  } catch {
    return null;
  }
};

const preferencesTable = () => supabase.from('user_preferences' as any);

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Track auth user id (so data loads AFTER login)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFromDatabase = useCallback(async (userId: string) => {
    const { data, error } = await preferencesTable()
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as UserPreferencesRow;

    return {
      cigarettesPerDay: row.cigarettes_per_day,
      yearsSmoked: row.years_smoked,
      pricePerPack: Number(row.price_per_pack),
      cigarettesPerPack: row.cigarettes_per_pack,
      quitDate: new Date(row.quit_date),
      currency: row.currency || 'EUR',
    } satisfies UserData;
  }, []);

  const upsertToDatabase = useCallback(async (userId: string, data: UserData) => {
    await preferencesTable().upsert(
      {
        user_id: userId,
        cigarettes_per_day: data.cigarettesPerDay,
        years_smoked: data.yearsSmoked,
        price_per_pack: data.pricePerPack,
        cigarettes_per_pack: data.cigarettesPerPack,
        quit_date: data.quitDate.toISOString(),
        currency: data.currency || 'EUR',
      },
      { onConflict: 'user_id' }
    );
  }, []);

  // Load user data whenever auth changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      if (authUserId) {
        const dbData = await fetchFromDatabase(authUserId);
        if (cancelled) return;

        if (dbData) {
          const dataWithCurrency = { ...dbData, currency: dbData.currency || 'EUR' };
          setUserData(dataWithCurrency);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithCurrency));
          setIsLoading(false);
          return;
        }

        // No DB record yet -> fall back to localStorage and seed DB once
        const local = readLocalUserData();
        if (local) {
          setUserData(local);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
          void upsertToDatabase(authUserId, local);
        } else {
          setUserData(null);
        }

        setIsLoading(false);
        return;
      }

      // Logged out: keep local copy (app still gates dashboard by auth)
      setUserData(readLocalUserData());
      setIsLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [authUserId, fetchFromDatabase, upsertToDatabase]);

  const saveUserData = useCallback(
    async (data: UserData) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setUserData(data);

      try {
        const userId =
          authUserId ?? (await supabase.auth.getUser()).data.user?.id ?? null;

        if (userId) {
          await upsertToDatabase(userId, data);
        }
      } catch {
        // Keep local save even if network fails
      }
    },
    [authUserId, upsertToDatabase]
  );

  const clearUserData = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);

    try {
      const userId =
        authUserId ?? (await supabase.auth.getUser()).data.user?.id ?? null;

      if (userId) {
        await preferencesTable().delete().eq('user_id', userId);
      }
    } catch {
      // ignore
    }
  }, [authUserId]);

  const resetProgram = useCallback(async () => {
    // Clear user data to show onboarding again
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('breathe-free-seen-stats');
    setUserData(null);

    try {
      const userId =
        authUserId ?? (await supabase.auth.getUser()).data.user?.id ?? null;

      if (userId) {
        await preferencesTable().delete().eq('user_id', userId);
      }
    } catch {
      // ignore
    }
  }, [authUserId]);

  return { userData, saveUserData, clearUserData, resetProgram, isLoading };
}
