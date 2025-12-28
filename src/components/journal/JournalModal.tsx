import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournal } from '@/hooks/useJournal';
import JournalEntryForm from './JournalEntry';
import JournalHistory from './JournalHistory';
import { BookOpen, History, Loader2 } from 'lucide-react';

interface JournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ open, onOpenChange }) => {
  const { entries, todayEntry, isLoading, saveEntry } = useJournal();
  const [activeTab, setActiveTab] = useState('today');

  const handleSave = async (mood: number, craving: number, notes: string) => {
    const success = await saveEntry(mood, craving, notes);
    if (success) {
      setActiveTab('history');
    }
    return success;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Daily Journal
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="today" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History ({entries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-0">
              <JournalEntryForm todayEntry={todayEntry} onSave={handleSave} />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <JournalHistory entries={entries} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JournalModal;
