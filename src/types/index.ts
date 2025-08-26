export interface PhotoMeal {
  id: string;
  timestamp: string;
  photoUrl: string;
  description: string;
  calories: number;
  aiEstimatedCalories?: number;
}

export interface Goal {
  id: string;
  type: 'weight' | 'calories';
  target: number;
  startDate: string;
  endDate: string;
  current: number;
}
