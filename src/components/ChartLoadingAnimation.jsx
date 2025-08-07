import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function ChartLoadingAnimation() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Тексты о построении карты
  const loadingSteps = [
    t('profile.loading.calculating'),
    t('profile.loading.analyzing'),
    t('profile.loading.building'),
    t('profile.loading.finalizing')
  ];

  // Анимация смены текста
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  // Повторение анимации карты
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 9000); // Полный цикл анимации ~9 секунд
    
    return () => clearInterval(animationInterval);
  }, []);

  // Анимация сборки карты из кусочков - квадратная структура с вертикальными и горизонтальными линиями
  const chartPieces = [
    // Центральный ромб (дом 9, 12, 3, 6)
    { id: 'center', path: 'M 50 50 L 70 30 L 50 10 L 30 30 Z', delay: 0 },
    // Верхний ромб (дом 10, 11)
    { id: 'top', path: 'M 50 10 L 70 30 L 50 50 L 30 30 Z', delay: 0.3 },
    // Правый ромб (дом 7, 8)
    { id: 'right', path: 'M 70 30 L 90 50 L 70 70 L 50 50 Z', delay: 0.6 },
    // Нижний ромб (дом 4, 5)
    { id: 'bottom', path: 'M 50 50 L 70 70 L 50 90 L 30 70 Z', delay: 0.9 },
    // Левый ромб (дом 1, 2)
    { id: 'left', path: 'M 30 30 L 50 50 L 30 70 L 10 50 Z', delay: 1.2 },
    // Диагональные линии (соединяющие углы)
    { id: 'diagonal1', path: 'M 10 10 L 90 90', delay: 1.5 },
    { id: 'diagonal2', path: 'M 90 10 L 10 90', delay: 1.8 },
    // Горизонтальная линия (соединяющая стороны)
    { id: 'horizontal', path: 'M 10 50 L 90 50', delay: 2.1 },
    // Вертикальная линия (соединяющая стороны)
    { id: 'vertical', path: 'M 50 10 L 50 90', delay: 2.4 },
    // Внешние вертикальные линии для формирования квадрата
    { id: 'vertical-left', path: 'M 10 10 L 10 90', delay: 2.7 },
    { id: 'vertical-right', path: 'M 90 10 L 90 90', delay: 3.0 },
    // Внешние горизонтальные линии для формирования квадрата
    { id: 'horizontal-top', path: 'M 10 10 L 90 10', delay: 3.3 },
    { id: 'horizontal-bottom', path: 'M 10 90 L 90 90', delay: 3.6 }
  ];

  // Данные для анимации появления на карте
  const chartData = [
    // Номера домов в угловых секциях
    { id: 'house-1', text: '1', x: 85, y: 15, delay: 4.0 },
    { id: 'house-2', text: '2', x: 15, y: 15, delay: 4.1 },
    
    // Планеты в центральном ромбе
    { id: 'moon', text: '04° M R', x: 50, y: 45, delay: 5.3 },
    { id: 'rahu', text: '03° Ra R', x: 45, y: 55, delay: 5.4 },
    { id: 'venus', text: '03° Ve R', x: 55, y: 55, delay: 5.5 },
    { id: 'asc', text: '08° As', x: 50, y: 65, delay: 5.6 },
    { id: 'ketu', text: '03° Ke R', x: 50, y: 75, delay: 5.7 },
    
    // Планеты в угловых треугольниках
    { id: 'sun', text: '17° S', x: 25, y: 35, delay: 5.8 },
    { id: 'rahu-simple', text: 'Ra', x: 75, y: 25, delay: 5.9 },
    { id: 'mars', text: 'Ma', x: 75, y: 35, delay: 6.0 },
    { id: 'mars-deg', text: '29°', x: 75, y: 45, delay: 6.1 },
    { id: 'jupiter-deg', text: '21°', x: 75, y: 55, delay: 6.2 },
    { id: 'saturn', text: '00° Sa', x: 25, y: 65, delay: 6.3 },
    
    // Внешние элементы
    { id: 'retrograde', text: 'R', x: 15, y: 15, delay: 6.4 },
    { id: 'house-12', text: '12', x: 25, y: 85, delay: 6.5 },
    { id: 'house-6', text: '6', x: 75, y: 85, delay: 6.6 },
    
    // Список планет под картой
    { id: 'planets-list', text: 'Su Ma Me Ju Ve Sa Ra Ke As', x: 50, y: 95, delay: 6.7 }
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Анимированный текст */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xl font-mono text-gray-800">
          {loadingSteps[currentStep]}
        </p>
      </motion.div>

      {/* Анимированная карта */}
      <div className="relative w-48 h-48">
        <svg
          key={animationKey}
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}
        >
          {/* Фоновая сетка */}
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#f5f5f5" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Анимированные кусочки карты */}
          {chartPieces.map((piece) => (
            <motion.path
              key={`${piece.id}-${animationKey}`}
              d={piece.path}
              fill="none"
              stroke="#000"
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ 
                pathLength: 0,
                opacity: 0,
                scale: 0.9
              }}
              animate={{ 
                pathLength: 1,
                opacity: 1,
                scale: 1
              }}
              transition={{
                pathLength: { duration: 1.0, delay: piece.delay, ease: "easeOut" },
                opacity: { duration: 0.6, delay: piece.delay },
                scale: { duration: 0.8, delay: piece.delay }
              }}
            />
          ))}
          
          {/* Центральная точка */}
          <motion.circle
            key={`center-${animationKey}`}
            cx="50"
            cy="50"
            r="1.5"
            fill="#000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 3.9, duration: 0.4 }}
          />
          
          {/* Точки в углах ромбов */}
          {[
            { x: 30, y: 30 },
            { x: 70, y: 30 },
            { x: 70, y: 70 },
            { x: 30, y: 70 }
          ].map((point, index) => (
            <motion.circle
              key={`corner-${index}-${animationKey}`}
              cx={point.x}
              cy={point.y}
              r="0.8"
              fill="#000"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 4.2 + index * 0.1, duration: 0.3 }}
            />
          ))}
          
          {/* Дополнительные точки соединения */}
          {[
            { x: 50, y: 30 },
            { x: 70, y: 50 },
            { x: 50, y: 70 },
            { x: 30, y: 50 }
          ].map((point, index) => (
            <motion.circle
              key={`mid-${index}-${animationKey}`}
              cx={point.x}
              cy={point.y}
              r="0.6"
              fill="#000"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 4.6 + index * 0.05, duration: 0.25 }}
            />
          ))}
          
          {/* Точки в углах внешнего квадрата */}
          {[
            { x: 10, y: 10 },
            { x: 90, y: 10 },
            { x: 90, y: 90 },
            { x: 10, y: 90 }
          ].map((point, index) => (
            <motion.circle
              key={`square-corner-${index}-${animationKey}`}
              cx={point.x}
              cy={point.y}
              r="0.5"
              fill="#000"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 4.8 + index * 0.05, duration: 0.2 }}
            />
          ))}
          
          {/* Анимированные данные карты */}
          {chartData.map((item) => (
            <motion.text
              key={`${item.id}-${animationKey}`}
              x={item.x}
              y={item.y}
              fontSize="6"
              fontFamily="monospace"
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
              initial={{ 
                opacity: 0,
                scale: 0.8,
                y: item.y + 2
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                y: item.y
              }}
              transition={{
                opacity: { duration: 0.4, delay: item.delay },
                scale: { duration: 0.3, delay: item.delay },
                y: { duration: 0.3, delay: item.delay }
              }}
            >
              {item.text}
            </motion.text>
          ))}
        </svg>
      </div>

      {/* Текст предупреждения */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center mt-8 px-4"
      >
        <p className="text-sm font-mono text-gray-600 max-w-xs">
          {t('profile.loading.warning')}
        </p>
      </motion.div>
    </div>
  );
} 