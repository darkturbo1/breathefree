import { UserData, Stats, getCurrencySymbol } from '@/types/smoking';
import { getCurrentAndNextMilestone } from './healthMilestones';

export function calculateStats(userData: UserData): Stats {
  const now = new Date();
  const quitDate = new Date(userData.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();

  // Time calculations
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Cigarettes not smoked
  const totalHours = diffMs / (1000 * 60 * 60);
  const cigarettesPerHour = userData.cigarettesPerDay / 24;
  const cigarettesNotSmoked = Math.floor(cigarettesPerHour * totalHours);

  // Money saved
  const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
  const moneySaved = cigarettesNotSmoked * pricePerCigarette;

  // Life regained (each cigarette takes ~11 minutes of life)
  const lifetimeRegained = cigarettesNotSmoked * 11;

  // Milestones
  const { current, next } = getCurrentAndNextMilestone(totalHours);

  return {
    timeSinceQuit: { days, hours, minutes, seconds },
    cigarettesNotSmoked,
    moneySaved,
    lifetimeRegained,
    currentMilestone: current,
    nextMilestone: next,
  };
}

export function formatTime(time: Stats['timeSinceQuit']): string {
  if (time.days > 0) {
    return `${time.days}d ${time.hours}h ${time.minutes}m`;
  }
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
  }
  if (time.minutes > 0) {
    return `${time.minutes}m ${time.seconds}s`;
  }
  return `${time.seconds}s`;
}

export function formatMoney(amount: number, currencyCode = 'EUR'): string {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatLifetime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return `${hours}h ${remainingMinutes}m`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
}
