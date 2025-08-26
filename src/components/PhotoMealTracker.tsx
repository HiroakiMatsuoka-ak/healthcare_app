'use client';

import { useState, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import useUserStore from '@/store/userStore';
import type { PhotoMeal } from '@/types';

export default function PhotoMealTracker() {
  const { photoMeals, addPhotoMeal, removePhotoMeal } = useUserStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  // モデルの読み込み
  const loadModel = useCallback(async () => {
    try {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }, []);

  // 写真からの食事検出と推定
  const detectFood = async (imageUrl: string) => {
    if (!model) {
      await loadModel();
    }
    
    if (model) {
      setIsProcessing(true);
      try {
        const img = new Image();
        img.src = imageUrl;
        await img.decode(); // 画像の読み込み完了を待つ
        
        const predictions = await model.detect(img);
        
        // 食べ物らしきものを検出
        const foodItems = predictions.filter(pred => 
          ['food', 'pizza', 'sandwich', 'hot dog', 'cake', 'donut', 'apple', 'orange']
            .some(food => pred.class.toLowerCase().includes(food))
        );

        // 仮のカロリー推定（実際のアプリではより高度な推定が必要）
        const estimatedCalories = foodItems.length * 200; // 仮の計算
        setCalories(estimatedCalories);
        
        const detectedFoods = foodItems.map(item => item.class).join(', ');
        if (detectedFoods) {
          setDescription(detectedFoods);
        }
      } catch (error) {
        console.error('Error detecting food:', error);
      }
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      await detectFood(url);
    }
  };

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhotoUrl(imageSrc);
      await detectFood(imageSrc);
      setIsUsingCamera(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeal: Omit<PhotoMeal, 'id'> = {
      timestamp: new Date().toISOString(),
      photoUrl,
      description,
      calories,
      aiEstimatedCalories: calories
    };
    addPhotoMeal(newMeal);
    setIsAdding(false);
    setPhotoUrl('');
    setDescription('');
    setCalories(0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">写真付き食事記録</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            食事を記録
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          {isUsingCamera ? (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded"
              />
              <button
                type="button"
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                撮影
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="食事の写真"
                    className="w-full h-64 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsUsingCamera(true)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    カメラを使用
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="block w-full px-4 py-2 bg-gray-100 text-center rounded cursor-pointer hover:bg-gray-200"
                    >
                      写真をアップロード
                    </label>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="text-center text-gray-600">
                  写真を分析中...
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="食事の内容を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カロリー (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-4">
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
                  保存
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <div className="space-y-4">
        {photoMeals.map((meal) => (
          <div key={meal.id} className="flex gap-4 p-4 bg-gray-50 rounded">
            <img
              src={meal.photoUrl}
              alt={meal.description}
              className="w-32 h-32 object-cover rounded"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{meal.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(meal.timestamp), 'yyyy/MM/dd HH:mm')}
                  </p>
                </div>
                <button
                  onClick={() => removePhotoMeal(meal.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  削除
                </button>
              </div>
              <p className="mt-2">
                {meal.calories} kcal
                {meal.aiEstimatedCalories && meal.aiEstimatedCalories !== meal.calories && (
                  <span className="text-sm text-gray-500 ml-2">
                    (AI推定: {meal.aiEstimatedCalories} kcal)
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
