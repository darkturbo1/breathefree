export interface UserData {
  cigarettesPerDay: number;
  yearsSmoked: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  quitDate: Date;
}

export interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  timeInHours: number;
  icon: string;
  achieved: boolean;
  progress: number;
}

export interface Stats {
  timeSinceQuit: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  cigarettesNotSmoked: number;
  moneySaved: number;
  lifetimeRegained: number; // in minutes
  currentMilestone: HealthMilestone | null;
  nextMilestone: HealthMilestone | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
