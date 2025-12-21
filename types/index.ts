export type IssueCategory = 
  | 'graffiti'
  | 'pothole'
  | 'encampment'
  | 'drug_use'
  | 'trash'
  | 'broken_streetlight'
  | 'abandoned_vehicle'
  | 'other';

export interface Report {
  id: string;
  category: IssueCategory;
  imageUri: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: number;
  points: number;
  status: 'submitted' | 'in_progress' | 'resolved';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
}

export interface UserStats {
  totalReports: number;
  totalPoints: number;
  streak: number;
  level: number;
  achievements: Achievement[];
}
