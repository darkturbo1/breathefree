import React from 'react';
import { JournalEntry, MOOD_LABELS, CRAVING_LABELS } from '@/types/journal';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JournalHistoryProps {
  entries: JournalEntry[];
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">📓</p>
        <p>No entries yet.</p>
        <p className="text-sm">Start journaling to track your progress!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {entries.map((entry) => {
          const moodInfo = MOOD_LABELS[entry.mood];
          const cravingLabel = CRAVING_LABELS[entry.craving_intensity];
          const isToday = entry.entry_date === new Date().toISOString().split('T')[0];

          return (
            <div
              key={entry.id}
              className={`p-4 rounded-xl border transition-colors ${
                isToday ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodInfo.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">
                      {isToday ? 'Today' : format(parseISO(entry.entry_date), 'EEEE, MMM d')}
                    </p>
                    <p className="text-xs text-muted-foreground">{moodInfo.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    entry.craving_intensity <= 3 ? 'text-success' : 
                    entry.craving_intensity <= 6 ? 'text-warning' : 'text-destructive'
                  }`}>
                    Craving: {entry.craving_intensity}/10
                  </p>
                  <p className="text-xs text-muted-foreground">{cravingLabel}</p>
                </div>
              </div>
              {entry.notes && (
                <p className="text-sm text-muted-foreground border-t border-border/50 pt-3 mt-3">
                  {entry.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default JournalHistory;
