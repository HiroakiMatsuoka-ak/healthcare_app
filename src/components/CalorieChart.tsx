'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useUserStore from '@/store/userStore';

export default function CalorieChart() {
  const { dailyCalories, calculateBMR } = useUserStore();
  
  // 過去7日間のデータを取得
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayData = dailyCalories.find(d => d.date === date);
    const bmr = calculateBMR();
    
    return {
      date: new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
      消費カロリー: dayData ? bmr + dayData.burned : bmr,
      摂取カロリー: dayData?.consumed || 0,
      基礎代謝: bmr
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">カロリー推移</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="消費カロリー"
              stroke="#f97316"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="摂取カロリー"
              stroke="#22c55e"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="基礎代謝"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
