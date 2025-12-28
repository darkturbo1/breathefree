import { HealthMilestone } from '@/types/smoking';

export const healthMilestones: Omit<HealthMilestone, 'achieved' | 'progress'>[] = [
  // Minutes to hours
  {
    id: '20min',
    title: 'Heart Rate Normalizes',
    description: 'Your heart rate and blood pressure begin to drop to normal levels.',
    timeInHours: 0.33,
    icon: '❤️',
  },
  {
    id: '2hours',
    title: 'Nicotine Cravings Begin',
    description: 'You may feel the first cravings. Stay strong - they peak and pass!',
    timeInHours: 2,
    icon: '💪',
  },
  {
    id: '4hours',
    title: 'Blood Sugar Stabilizes',
    description: 'Your blood sugar levels are normalizing without nicotine stimulation.',
    timeInHours: 4,
    icon: '🩸',
  },
  {
    id: '8hours',
    title: 'Oxygen Levels Rise',
    description: 'Carbon monoxide levels in your blood drop, oxygen levels increase.',
    timeInHours: 8,
    icon: '🫁',
  },
  {
    id: '12hours',
    title: 'Carbon Monoxide Cleared',
    description: 'Carbon monoxide levels return to normal, improving oxygen delivery.',
    timeInHours: 12,
    icon: '🌬️',
  },
  // Day milestones
  {
    id: '24hours',
    title: 'Heart Attack Risk Drops',
    description: 'Your risk of heart attack begins to decrease significantly.',
    timeInHours: 24,
    icon: '🫀',
  },
  {
    id: '36hours',
    title: 'Sense of Smell Returns',
    description: 'Your sense of smell and taste start to improve noticeably.',
    timeInHours: 36,
    icon: '👃',
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
    icon: '🌈',
  },
  {
    id: '5days',
    title: 'Cravings Reduce',
    description: 'Most nicotine cravings last only 3-5 minutes. You\'re getting stronger!',
    timeInHours: 120,
    icon: '🎯',
  },
  // Week milestones
  {
    id: '1week',
    title: 'One Week Strong',
    description: 'You\'ve made it a full week! The hardest part is behind you.',
    timeInHours: 168,
    icon: '🌟',
  },
  {
    id: '10days',
    title: 'Circulation Improving',
    description: 'Blood flow to your gums and teeth is now similar to a non-smoker.',
    timeInHours: 240,
    icon: '😁',
  },
  {
    id: '2weeks',
    title: 'Circulation Boost',
    description: 'Your circulation has significantly improved, walking becomes easier.',
    timeInHours: 336,
    icon: '🚶',
  },
  {
    id: '3weeks',
    title: 'Withdrawal Fading',
    description: 'Physical withdrawal symptoms are mostly gone. Mental habits remain.',
    timeInHours: 504,
    icon: '🧘',
  },
  // Month milestones
  {
    id: '1month',
    title: 'Lung Function Boost',
    description: 'Lung function increases up to 30%. Coughing and shortness of breath decrease.',
    timeInHours: 720,
    icon: '🏃',
  },
  {
    id: '6weeks',
    title: 'Skin Glowing',
    description: 'Your skin is clearer and more hydrated. The "smoker\'s complexion" fades.',
    timeInHours: 1008,
    icon: '✨',
  },
  {
    id: '2months',
    title: 'Cilia Recovering',
    description: 'The cilia in your lungs are regrowing, helping clear mucus and debris.',
    timeInHours: 1440,
    icon: '🌱',
  },
  {
    id: '3months',
    title: 'Cilia Regenerated',
    description: 'The cilia in your lungs have regrown, reducing risk of infection.',
    timeInHours: 2160,
    icon: '🛡️',
  },
  {
    id: '4months',
    title: 'Exercise Easier',
    description: 'Physical activities feel easier. Your body is healing rapidly.',
    timeInHours: 2880,
    icon: '🏋️',
  },
  {
    id: '6months',
    title: 'Stress Response Normal',
    description: 'Your body\'s stress response has normalized without nicotine.',
    timeInHours: 4320,
    icon: '😌',
  },
  {
    id: '9months',
    title: 'Lungs Significantly Healed',
    description: 'Lung cilia fully recovered. Infections, colds, and breathing issues decrease.',
    timeInHours: 6480,
    icon: '💨',
  },
  // Year milestones
  {
    id: '1year',
    title: 'Heart Disease Risk Halved',
    description: 'Your excess risk of coronary heart disease is now half that of a smoker.',
    timeInHours: 8760,
    icon: '🎉',
  },
  {
    id: '18months',
    title: 'Lung Cancer Risk Dropping',
    description: 'Your risk of lung cancer is starting to decrease significantly.',
    timeInHours: 13140,
    icon: '📉',
  },
  {
    id: '2years',
    title: 'Stroke Risk Reduced',
    description: 'Your risk of stroke has dramatically decreased.',
    timeInHours: 17520,
    icon: '🧠',
  },
  {
    id: '3years',
    title: 'Heart Attack Risk Normal',
    description: 'Your risk of heart attack is now similar to someone who never smoked.',
    timeInHours: 26280,
    icon: '❤️‍🩹',
  },
  {
    id: '5years',
    title: 'Stroke Risk Normalized',
    description: 'Your risk of stroke is now the same as a non-smoker.',
    timeInHours: 43800,
    icon: '🧠',
  },
  {
    id: '7years',
    title: 'Type 2 Diabetes Risk Normal',
    description: 'Your risk of type 2 diabetes is the same as a non-smoker.',
    timeInHours: 61320,
    icon: '🩺',
  },
  {
    id: '10years',
    title: 'Lung Cancer Risk Halved',
    description: 'Your risk of dying from lung cancer is about half that of a smoker.',
    timeInHours: 87600,
    icon: '🏆',
  },
  {
    id: '15years',
    title: 'Heart Disease Risk Normal',
    description: 'Your risk of heart disease is now equal to a non-smoker.',
    timeInHours: 131400,
    icon: '💖',
  },
  {
    id: '20years',
    title: 'All Risks Normalized',
    description: 'Your risk of death from smoking-related causes is similar to a non-smoker.',
    timeInHours: 175200,
    icon: '👑',
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
