'use client';

import { useState } from 'react';
import useUserStore from '@/store/userStore';

export default function UserProfile() {
  const { gender, age, height, weight, activityLevel, setUserInfo } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gender,
    age,
    height,
    weight,
    activityLevel
  });
  
  const activityLevels = {
    sedentary: '運動なし（デスクワーク中心）',
    light: '軽い運動（週1-3回）',
    moderate: '中程度の運動（週3-5回）',
    active: '活発な運動（週6-7回）',
    very_active: '非常に活発な運動（1日2回）'
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfo(formData);
    setIsEditing(false);
  };
  
  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">プロフィール</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            編集
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">性別</p>
            <p className="font-medium">{gender === 'male' ? '男性' : '女性'}</p>
          </div>
          <div>
            <p className="text-gray-600">年齢</p>
            <p className="font-medium">{age}歳</p>
          </div>
          <div>
            <p className="text-gray-600">身長</p>
            <p className="font-medium">{height}cm</p>
          </div>
          <div>
            <p className="text-gray-600">体重</p>
            <p className="font-medium">{weight}kg</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">活動レベル</p>
            <p className="font-medium">{activityLevels[activityLevel]}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">プロフィール編集</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            性別
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
            className="w-full p-2 border rounded"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年齢
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            身長 (cm)
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            体重 (kg)
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            活動レベル
          </label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as any }))}
            className="w-full p-2 border rounded"
          >
            {Object.entries(activityLevels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </form>
  );
}
