import React from 'react';
import { useJournal } from '@/hooks/useJournal';
import JournalEntryForm from '../journal/JournalEntry';
import JournalHistory from '../journal/JournalHistory';
import { Loader2 } from 'lucide-react';

const JournalTab: React.FC = () => {
  const { entries, todayEntry, isLoading, saveEntry } = useJournal();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Today's Entry */}
      <div className="glass-panel-strong p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">📝</span> Today's Check-in
        </h2>
        <JournalEntryForm todayEntry={todayEntry} onSave={saveEntry} />
      </div>

      {/* History */}
      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">📖</span> Past Entries
        </h2>
        <div className="glass-panel-strong p-4">
          <JournalHistory entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default JournalTab;
