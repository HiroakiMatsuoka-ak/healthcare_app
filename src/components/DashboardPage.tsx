'use client';

import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import UserProfile from './UserProfile';
import CalorieChart from './CalorieChart';
import MealTracker from './MealTracker';
import GoalSetting from './GoalSetting';
import PhotoMealTracker from './PhotoMealTracker';

export default function DashboardPage() {
  const { calculateBMR, meals, addDailyCalories } = useUserStore();

  // 今日の食事から総カロリーを計算
  const calculateTodayCalories = () => {
    const today = new Date().toDateString();
    return meals
      .filter(meal => new Date(meal.timestamp).toDateString() === today)
      .reduce((total, meal) => total + meal.calories, 0);
  };

  // 消費カロリーと摂取カロリーを記録
  useEffect(() => {
    const consumedCalories = calculateTodayCalories();
    // 運動による消費カロリーは仮に基礎代謝の20%とする
    const burnedCalories = Math.round(calculateBMR() * 0.2);
    
    addDailyCalories({
      consumed: consumedCalories,
      burned: burnedCalories
    });
  }, [meals, calculateBMR, addDailyCalories]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">健康管理ダッシュボード</h1>
      
      <UserProfile />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg shadow p-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">基礎代謝量</h2>
          <p className="text-2xl font-bold text-blue-600">{calculateBMR()} kcal</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">今日の摂取カロリー</h2>
          <p className="text-2xl font-bold text-green-600">{calculateTodayCalories()} kcal</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">予想消費カロリー</h2>
          <p className="text-2xl font-bold text-orange-600">{calculateBMR() + Math.round(calculateBMR() * 0.2)} kcal</p>
        </div>
      </div>
      
      <CalorieChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalSetting />
        <PhotoMealTracker />
      </div>
      
      <MealTracker />
    </div>
  );
}
