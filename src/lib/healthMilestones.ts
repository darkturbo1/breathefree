import { HealthMilestone } from '@/types/smoking';

export const healthMilestones: Omit<HealthMilestone, 'achieved' | 'progress'>[] = [
  {
    id: '20min',
    title: 'Heart Rate Normalizes',
    description: 'Your heart rate and blood pressure begin to drop to normal levels.',
    timeInHours: 0.33,
    icon: '❤️',
  },
  {
    id: '8hours',
    title: 'Oxygen Levels Rise',
    description: 'Carbon monoxide levels in your blood drop, oxygen levels increase.',
    timeInHours: 8,
    icon: '🫁',
  },
  {
    id: '24hours',
    title: 'Heart Attack Risk Drops',
    description: 'Your risk of heart attack begins to decrease significantly.',
    timeInHours: 24,
    icon: '💪',
  },
  {
    id: '48hours',
    title: 'Nicotine Free',
    description: 'All nicotine has left your body. Nerve endings start regenerating.',
    timeInHours: 48,
    icon: '✨',
  },
  {
    id: '72hours',
    title: 'Breathing Easier',
    description: 'Bronchial tubes relax, breathing becomes easier, energy increases.',
    timeInHours: 72,
    icon: '🌬️',
  },
  {
    id: '2weeks',
    title: 'Circulation Improves',
    description: 'Your circulation has significantly improved, walking becomes easier.',
    timeInHours: 336,
    icon: '🚶',
  },
  {
    id: '1month',
    title: 'Lung Function Boost',
    description: 'Lung function increases up to 30%. Coughing and shortness of breath decrease.',
    timeInHours: 720,
    icon: '🏃',
  },
  {
    id: '3months',
    title: 'Cilia Regenerate',
    description: 'The cilia in your lungs have regrown, reducing risk of infection.',
    timeInHours: 2160,
    icon: '🛡️',
  },
  {
    id: '1year',
    title: 'Heart Disease Risk Halved',
    description: 'Your excess risk of coronary heart disease is now half that of a smoker.',
    timeInHours: 8760,
    icon: '🎉',
  },
  {
    id: '5years',
    title: 'Stroke Risk Normalized',
    description: 'Your risk of stroke is now the same as a non-smoker.',
    timeInHours: 43800,
    icon: '🧠',
  },
  {
    id: '10years',
    title: 'Lung Cancer Risk Halved',
    description: 'Your risk of dying from lung cancer is about half that of a smoker.',
    timeInHours: 87600,
    icon: '🏆',
  },
];

export function calculateMilestones(hoursSinceQuit: number): HealthMilestone[] {
  return healthMilestones.map((milestone) => ({
    ...milestone,
    achieved: hoursSinceQuit >= milestone.timeInHours,
    progress: Math.min(100, (hoursSinceQuit / milestone.timeInHours) * 100),
  }));
}

export function getCurrentAndNextMilestone(hoursSinceQuit: number) {
  const milestones = calculateMilestones(hoursSinceQuit);
  const achieved = milestones.filter((m) => m.achieved);
  const upcoming = milestones.filter((m) => !m.achieved);

  return {
    current: achieved[achieved.length - 1] || null,
    next: upcoming[0] || null,
  };
}
