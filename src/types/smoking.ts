export interface UserData {
  cigarettesPerDay: number;
  yearsSmoked: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  quitDate: Date;
  currency: string;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

export const getCurrencySymbol = (code: string): string => {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency?.symbol || '$';
};

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
