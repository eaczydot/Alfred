import { IssueCategory } from '@/types';

export const CATEGORY_CONFIG: Record<IssueCategory, {
  label: string;
  icon: string;
  color: string;
  points: number;
  description: string;
}> = {
  graffiti: {
    label: 'Graffiti',
    icon: 'spray-can',
    color: '#ff9f0a', // Amber (QoL) - was Pinkish
    points: 10,
    description: 'Vandalism and graffiti on public or private property'
  },
  pothole: {
    label: 'Pothole',
    icon: 'construction',
    color: '#00e5ff', // Cyan (Infrastructure)
    points: 15,
    description: 'Road damage and potholes'
  },
  encampment: {
    label: 'Encampment',
    icon: 'tent',
    color: '#38bdf8', // Light Blue
    points: 20,
    description: 'Homeless encampments'
  },
  drug_use: {
    label: 'Drug Use',
    icon: 'syringe',
    color: '#ef4444', // Red (Safety/Urgent) - was Pinkish
    points: 25,
    description: 'Public drug use or paraphernalia'
  },
  trash: {
    label: 'Trash',
    icon: 'trash-2',
    color: '#eab308', // Yellow (Sanitary/Warn)
    points: 8,
    description: 'Illegal dumping or excessive litter'
  },
  broken_streetlight: {
    label: 'Street Light',
    icon: 'lightbulb-off',
    color: '#f97316', // Orange
    points: 12,
    description: 'Broken or non-functioning street lights'
  },
  abandoned_vehicle: {
    label: 'Abandoned Vehicle',
    icon: 'car',
    color: '#64748b', // Slate/Cool Gray - was Purple
    points: 18,
    description: 'Abandoned or illegally parked vehicles'
  },
  other: {
    label: 'Other',
    icon: 'help-circle',
    color: '#94a3b8', // Gray
    points: 10,
    description: 'Other civic issues'
  }
};

export const ACHIEVEMENTS = [
  {
    id: 'first_report',
    title: 'First Report',
    description: 'Submit your first report',
    icon: 'trophy',
    threshold: 1
  },
  {
    id: 'reporter_10',
    title: 'Getting Started',
    description: 'Submit 10 reports',
    icon: 'star',
    threshold: 10
  },
  {
    id: 'reporter_50',
    title: 'Civic Champion',
    description: 'Submit 50 reports',
    icon: 'award',
    threshold: 50
  },
  {
    id: 'reporter_100',
    title: 'Community Hero',
    description: 'Submit 100 reports',
    icon: 'shield',
    threshold: 100
  },
  {
    id: 'streak_7',
    title: 'Week Streak',
    description: 'Report issues for 7 days in a row',
    icon: 'flame',
    threshold: 7
  },
  {
    id: 'points_500',
    title: 'Point Collector',
    description: 'Earn 500 points',
    icon: 'gem',
    threshold: 500
  }
];
