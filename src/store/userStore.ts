import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meal {
  id: string;
  timestamp: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories: number;
}

interface UserState {
  // ユーザー基本情報
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // 食事記録
  meals: Meal[];
  
  // カロリー記録
  dailyCalories: {
    date: string;
    consumed: number;
    burned: number;
  }[];
  
  // アクション
  setUserInfo: (info: Partial<UserState>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: string) => void;
  addDailyCalories: (data: { consumed: number; burned: number }) => void;
  
  // 計算メソッド
  calculateBMR: () => number;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // デフォルト値
      gender: 'male',
      age: 30,
      height: 170,
      weight: 65,
      activityLevel: 'moderate',
      meals: [],
      dailyCalories: [],
      
      // アクション
      setUserInfo: (info) => set((state) => ({ ...state, ...info })),
      
      addMeal: (meal) => set((state) => ({
        meals: [...state.meals, { ...meal, id: Date.now().toString() }]
      })),
      
      removeMeal: (id) => set((state) => ({
        meals: state.meals.filter(meal => meal.id !== id)
      })),
      
      addDailyCalories: (data) => set((state) => ({
        dailyCalories: [...state.dailyCalories, {
          date: new Date().toISOString().split('T')[0],
          ...data
        }]
      })),
      
      // Harris-Benedict方程式を使用した基礎代謝量(BMR)の計算
      calculateBMR: () => {
        const state = get();
        let bmr = 0;
        
        if (state.gender === 'male') {
          bmr = 88.362 + (13.397 * state.weight) + (4.799 * state.height) - (5.677 * state.age);
        } else {
          bmr = 447.593 + (9.247 * state.weight) + (3.098 * state.height) - (4.330 * state.age);
        }
        
        // 活動レベルに応じた補正
        const activityMultipliers = {
          sedentary: 1.2,      // デスクワーク中心の生活
          light: 1.375,        // 軽い運動（週1-3回）
          moderate: 1.55,      // 中程度の運動（週3-5回）
          active: 1.725,       // 活発な運動（週6-7回）
          very_active: 1.9     // 非常に活発な運動（1日2回）
        };
        
        return Math.round(bmr * activityMultipliers[state.activityLevel]);
      }
    }),
    {
      name: 'user-storage'
    }
  )
);

export default useUserStore;
