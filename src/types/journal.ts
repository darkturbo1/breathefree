export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: number;
  craving_intensity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const MOOD_LABELS: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Terrible', emoji: '😫' },
  2: { label: 'Bad', emoji: '😔' },
  3: { label: 'Okay', emoji: '😐' },
  4: { label: 'Good', emoji: '😊' },
  5: { label: 'Great', emoji: '😁' },
};

export const CRAVING_LABELS: Record<number, string> = {
  1: 'None',
  2: 'Very Low',
  3: 'Low',
  4: 'Mild',
  5: 'Moderate',
  6: 'Notable',
  7: 'Strong',
  8: 'Very Strong',
  9: 'Intense',
  10: 'Extreme',
};
