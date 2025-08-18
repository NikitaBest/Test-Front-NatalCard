import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function HoroscopeLoadingAnimation() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Тексты о построении гороскопа
  const loadingSteps = [
    t('today.loading.calculating'),
    t('today.loading.analyzing'),
    t('today.loading.building'),
    t('today.loading.finalizing')
  ];

  // Минимальное время показа анимации (3 секунды)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Анимация смены текста
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  // Повторение анимации
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 8000); // 8 секунд для полного цикла
    
    return () => clearInterval(animationInterval);
  }, []);

  // Если анимация должна скрыться, возвращаем null
  if (!showAnimation) {
    return null;
  }

  // Астрологические символы для анимации
  const astroSymbols = [
    { id: 'ascendant', symbol: '↑', name: 'ASC', delay: 0 },
    { id: 'sun', symbol: '☉', name: 'SUN', delay: 0.5 },
    { id: 'moon', symbol: '☽', name: 'MOON', delay: 1.0 },
    { id: 'mercury', symbol: '☿', name: 'MERC', delay: 1.5 },
    { id: 'venus', symbol: '♀', name: 'VEN', delay: 2.0 },
    { id: 'mars', symbol: '♂', name: 'MARS', delay: 2.5 },
    { id: 'jupiter', symbol: '♃', name: 'JUP', delay: 3.0 },
    { id: 'saturn', symbol: '♄', name: 'SAT', delay: 3.5 }
  ];

  // Дома гороскопа
  const houses = [
    { id: 'house1', number: '1', delay: 4.0 },
    { id: 'house2', number: '2', delay: 4.2 },
    { id: 'house3', number: '3', delay: 4.4 },
    { id: 'house4', number: '4', delay: 4.6 },
    { id: 'house5', number: '5', delay: 4.8 },
    { id: 'house6', number: '6', delay: 5.0 },
    { id: 'house7', number: '7', delay: 5.2 },
    { id: 'house8', number: '8', delay: 5.4 },
    { id: 'house9', number: '9', delay: 5.6 },
    { id: 'house10', number: '10', delay: 5.8 },
    { id: 'house11', number: '11', delay: 6.0 },
    { id: 'house12', number: '12', delay: 6.2 }
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 px-4">
      {/* Анимированный текст */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-8 md:mb-12"
      >
        <p className="text-base sm:text-lg md:text-xl font-mono text-gray-800 px-2">
          {loadingSteps[currentStep]}
        </p>
      </motion.div>

      {/* Центральная астрологическая схема */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-6 sm:mb-8">
        <svg
          key={animationKey}
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          {/* Внешний круг */}
          <motion.circle
            key={`outer-circle-${animationKey}`}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#000"
            strokeWidth="0.5"
            initial={{ 
              pathLength: 0,
              opacity: 0
            }}
            animate={{ 
              pathLength: 1,
              opacity: 1
            }}
            transition={{ delay: 0, duration: 1.0 }}
          />
          
          {/* Внутренний круг */}
          <motion.circle
            key={`inner-circle-${animationKey}`}
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#000"
            strokeWidth="0.3"
            initial={{ 
              pathLength: 0,
              opacity: 0
            }}
            animate={{ 
              pathLength: 1,
              opacity: 1
            }}
            transition={{ delay: 0.5, duration: 1.0 }}
          />
          
          {/* Диагональные линии */}
          {[
            { x1: 5, y1: 5, x2: 95, y2: 95 },
            { x1: 95, y1: 5, x2: 5, y2: 95 }
          ].map((line, index) => (
            <motion.line
              key={`diagonal-${index}-${animationKey}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#000"
              strokeWidth="0.3"
              initial={{ 
                pathLength: 0,
                opacity: 0
              }}
              animate={{ 
                pathLength: 1,
                opacity: 1
              }}
              transition={{ delay: 1.0 + index * 0.2, duration: 0.8 }}
            />
          ))}
          
          {/* Горизонтальная и вертикальная линии */}
          {[
            { x1: 5, y1: 50, x2: 95, y2: 50 },
            { x1: 50, y1: 5, x2: 50, y2: 95 }
          ].map((line, index) => (
            <motion.line
              key={`cross-${index}-${animationKey}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#000"
              strokeWidth="0.3"
              initial={{ 
                pathLength: 0,
                opacity: 0
              }}
              animate={{ 
                pathLength: 1,
                opacity: 1
              }}
              transition={{ delay: 1.5 + index * 0.2, duration: 0.8 }}
            />
          ))}
          
          {/* Астрологические символы по кругу */}
          {astroSymbols.map((symbol, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const x = 50 + 35 * Math.cos(angle);
            const y = 50 + 35 * Math.sin(angle);
            
            return (
              <motion.g key={`${symbol.id}-${animationKey}`}>
                <motion.text
                  x={x}
                  y={y}
                  fontSize="4.5"
                  fontFamily="monospace"
                  fill="#000"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="bold"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    rotate: -180
                  }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    rotate: 0
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: symbol.delay },
                    scale: { duration: 0.5, delay: symbol.delay },
                    rotate: { duration: 0.5, delay: symbol.delay }
                  }}
                >
                  {symbol.symbol}
                </motion.text>
                <motion.text
                  x={x}
                  y={y + 5}
                  fontSize="2"
                  fontFamily="monospace"
                  fill="#000"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: symbol.delay + 0.3, duration: 0.3 }}
                >
                  {symbol.name}
                </motion.text>
              </motion.g>
            );
          })}
          
          {/* Номера домов */}
          {houses.map((house, index) => {
            const angle = (index * 30) * (Math.PI / 180);
            const x = 50 + 20 * Math.cos(angle);
            const y = 50 + 20 * Math.sin(angle);
            
            return (
              <motion.text
                key={`${house.id}-${animationKey}`}
                x={x}
                y={y}
                fontSize="3"
                fontFamily="monospace"
                fill="#000"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
                initial={{ 
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.4, delay: house.delay },
                  scale: { duration: 0.3, delay: house.delay }
                }}
              >
                {house.number}
              </motion.text>
            );
          })}
          
          {/* Центральная точка */}
          <motion.circle
            key={`center-${animationKey}`}
            cx="50"
            cy="50"
            r="1"
            fill="#000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 7.0, duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Текст предупреждения */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center mt-4 sm:mt-6 md:mt-8 px-4"
      >
        <p className="text-xs sm:text-sm font-mono text-gray-600 max-w-xs sm:max-w-sm md:max-w-md">
          {t('today.loading.warning')}
        </p>
      </motion.div>
    </div>
  );
} 