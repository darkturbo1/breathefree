import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types/journal';
import { useToast } from '@/hooks/use-toast';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
      
      const today = new Date().toISOString().split('T')[0];
      const todayData = data?.find(e => e.entry_date === today) || null;
      setTodayEntry(todayData);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const saveEntry = async (
    mood: number,
    cravingIntensity: number,
    notes: string
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save entries",
          variant: "destructive",
        });
        return false;
      }

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('journal_entries')
        .upsert({
          user_id: user.id,
          entry_date: today,
          mood,
          craving_intensity: cravingIntensity,
          notes: notes || null,
        }, {
          onConflict: 'user_id,entry_date',
        });

      if (error) throw error;

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved",
      });

      await fetchEntries();
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    entries,
    todayEntry,
    isLoading,
    saveEntry,
    refreshEntries: fetchEntries,
  };
}
