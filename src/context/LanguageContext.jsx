import { createContext, useContext, useState, useEffect } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import { useUser } from './UserContext';

const translations = { ru, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru');
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);
  const { setOnLanguageReceived } = useUser();
  
  console.log('LanguageProvider: инициализация, текущий язык:', language);
  console.log('LanguageProvider: setOnLanguageReceived доступен:', !!setOnLanguageReceived);
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Возвращаем ключ если перевод не найден
      }
    }
    
    return value || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      console.log('LanguageContext: изменение языка пользователем на:', lang);
      setLanguage(lang);
      localStorage.setItem('language', lang);
      // Язык будет отправлен вместе с остальными данными профиля
    }
  };

  // Настраиваем callback для получения языка ТОЛЬКО от бэкенда
  useEffect(() => {
    console.log('LanguageContext: useEffect запущен, setOnLanguageReceived:', !!setOnLanguageReceived);
    if (setOnLanguageReceived) {
      console.log('LanguageContext: устанавливаем callback для получения языка от бэкенда');
      setOnLanguageReceived((backendLanguage) => {
        console.log('LanguageContext: получен язык от бэкенда:', backendLanguage);
        console.log('LanguageContext: доступные переводы:', Object.keys(translations));
        if (backendLanguage && translations[backendLanguage]) {
          console.log('LanguageContext: ✅ Устанавливаем язык от бэкенда:', backendLanguage);
          console.log('LanguageContext: текущий язык до изменения:', language);
          setLanguage(backendLanguage);
          localStorage.setItem('language', backendLanguage);
          setIsLanguageInitialized(true);
          console.log('LanguageContext: язык установлен, инициализация завершена');
          
          // Принудительное обновление для гарантии смены языка
          setTimeout(() => {
            console.log('LanguageContext: принудительное обновление языка через 50ms');
            setLanguage(prevLang => {
              console.log('LanguageContext: принудительное обновление, предыдущий язык:', prevLang, 'новый:', backendLanguage);
              return backendLanguage;
            });
          }, 50);
        } else {
          console.log('LanguageContext: ❌ Язык от бэкенда не поддерживается или пустой:', backendLanguage);
          console.log('LanguageContext: оставляем язык по умолчанию (ru)');
          setIsLanguageInitialized(true);
        }
      });
    } else {
      console.log('LanguageContext: setOnLanguageReceived не доступен');
    }
  }, [setOnLanguageReceived]);

  // Fallback: если через 5 секунд не получили язык от бэкенда, оставляем по умолчанию
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isLanguageInitialized) {
        console.log('LanguageContext: ⏰ Таймаут 5 секунд, оставляем язык по умолчанию (ru)');
        setIsLanguageInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [isLanguageInitialized]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLanguageInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
} 