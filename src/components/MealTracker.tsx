'use client';

import { useState } from 'react';
import useUserStore, { Meal } from '@/store/userStore';

export default function MealTracker() {
  const { meals, addMeal, removeMeal } = useUserStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast' as Meal['type'],
    description: '',
    calories: 0
  });

  const mealTypes = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
    snack: 'おやつ'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeal({
      ...newMeal,
      timestamp: new Date().toISOString()
    });
    setNewMeal({
      type: 'breakfast',
      description: '',
      calories: 0
    });
    setIsAdding(false);
  };

  const todayMeals = meals.filter(meal => {
    const mealDate = new Date(meal.timestamp).toDateString();
    const today = new Date().toDateString();
    return mealDate === today;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">食事記録</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            食事を追加
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                種類
              </label>
              <select
                value={newMeal.type}
                onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value as Meal['type'] }))}
                className="w-full p-2 border rounded"
              >
                {Object.entries(mealTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カロリー (kcal)
              </label>
              <input
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <input
                type="text"
                value={newMeal.description}
                onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="例：ごはん、みそ汁、焼き魚"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              追加
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {todayMeals.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{mealTypes[meal.type]}</span>
                <span className="text-sm text-gray-500">
                  {new Date(meal.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-600">{meal.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{meal.calories} kcal</span>
              <button
                onClick={() => removeMeal(meal.id)}
                className="text-red-500 hover:text-red-600"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
