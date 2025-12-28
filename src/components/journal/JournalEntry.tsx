import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MOOD_LABELS, CRAVING_LABELS, JournalEntry as JournalEntryType } from '@/types/journal';
import { Save, Loader2 } from 'lucide-react';

interface JournalEntryProps {
  todayEntry: JournalEntryType | null;
  onSave: (mood: number, craving: number, notes: string) => Promise<boolean>;
}

const JournalEntryForm: React.FC<JournalEntryProps> = ({ todayEntry, onSave }) => {
  const [mood, setMood] = useState(todayEntry?.mood || 3);
  const [craving, setCraving] = useState(todayEntry?.craving_intensity || 5);
  const [notes, setNotes] = useState(todayEntry?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (todayEntry) {
      setMood(todayEntry.mood);
      setCraving(todayEntry.craving_intensity);
      setNotes(todayEntry.notes || '');
    }
  }, [todayEntry]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(mood, craving, notes);
    setIsSaving(false);
  };

  const moodInfo = MOOD_LABELS[mood];
  const cravingLabel = CRAVING_LABELS[craving];

  return (
    <div className="space-y-6">
      {/* Mood Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">How are you feeling today?</label>
          <span className="text-2xl">{moodInfo.emoji}</span>
        </div>
        <Slider
          value={[mood]}
          onValueChange={([val]) => setMood(val)}
          min={1}
          max={5}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Terrible</span>
          <span className="font-medium text-foreground">{moodInfo.label}</span>
          <span>Great</span>
        </div>
      </div>

      {/* Craving Intensity Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Craving intensity</label>
          <span className={`text-sm font-semibold ${craving <= 3 ? 'text-success' : craving <= 6 ? 'text-warning' : 'text-destructive'}`}>
            {craving}/10
          </span>
        </div>
        <Slider
          value={[craving]}
          onValueChange={([val]) => setCraving(val)}
          min={1}
          max={10}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>None</span>
          <span className="font-medium text-foreground">{cravingLabel}</span>
          <span>Extreme</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes & reflections</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your day? Any triggers? Wins to celebrate?"
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full"
        size="lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {todayEntry ? 'Update Entry' : 'Save Entry'}
          </>
        )}
      </Button>
    </div>
  );
};

export default JournalEntryForm;
