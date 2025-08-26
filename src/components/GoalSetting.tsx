'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Goal } from '@/types';
import useUserStore from '@/store/userStore';

export default function GoalSetting() {
  const { goals, addGoal, updateGoal, removeGoal, weight } = useUserStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    type: 'weight',
    target: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    current: weight
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal(newGoal);
    setIsAdding(false);
  };

  const calculateProgress = (goal: Goal) => {
    const total = goal.target - parseFloat(goal.current.toString());
    const current = goal.target - goal.current;
    const percentage = (current / total) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">目標設定</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            新しい目標
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標タイプ
              </label>
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value as 'weight' | 'calories' }))}
                className="w-full p-2 border rounded"
              >
                <option value="weight">体重</option>
                <option value="calories">1日のカロリー</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標値 {newGoal.type === 'weight' ? '(kg)' : '(kcal)'}
              </label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseFloat(e.target.value) }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={newGoal.startDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標日
              </label>
              <input
                type="date"
                value={newGoal.endDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border rounded"
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              設定
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  {goal.type === 'weight' ? '体重目標' : 'カロリー目標'}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(goal.startDate), 'yyyy/MM/dd')} - 
                  {format(new Date(goal.endDate), 'yyyy/MM/dd')}
                </p>
              </div>
              <button
                onClick={() => removeGoal(goal.id)}
                className="text-red-500 hover:text-red-600"
              >
                削除
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>目標: {goal.target}{goal.type === 'weight' ? 'kg' : 'kcal'}</span>
                <span>現在: {goal.current}{goal.type === 'weight' ? 'kg' : 'kcal'}</span>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${calculateProgress(goal)}%` }}
                />
              </div>

              <div>
                <input
                  type="number"
                  value={goal.current}
                  onChange={(e) => updateGoal(goal.id, parseFloat(e.target.value))}
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="現在の値を更新"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
