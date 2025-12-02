import { createContext, useContext, useState, useEffect } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import { useUser } from './UserContext';

const translations = { ru, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null);
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);
  const { setOnLanguageReceived } = useUser();
  
  console.log('LanguageProvider: инициализация, текущий язык:', language);
  console.log('LanguageProvider: setOnLanguageReceived доступен:', !!setOnLanguageReceived);
  
  // Очищаем localStorage при инициализации, чтобы язык брался только от бэкенда
  useEffect(() => {
    console.log('LanguageProvider: очищаем localStorage от старого языка');
    localStorage.removeItem('language');
  }, []);
  
  const t = (key) => {
    const keys = key.split('.');
    const currentLang = (language || 'ru') && translations[language || 'ru'] ? (language || 'ru') : 'ru';
    let value = translations[currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Возвращаем ключ если перевод не найден или язык еще не инициализирован
      }
    }
    
    // Логируем первые несколько вызовов для отладки
    if (Math.random() < 0.05) {
      console.log('LanguageContext: t() вызвана с ключом:', key, 'язык:', language, 'результат:', value || key);
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

  // Функция для принудительной установки языка от бэкенда (игнорирует localStorage)
  const setLanguageFromBackend = (lang) => {
    if (translations[lang]) {
      console.log('LanguageContext: принудительная установка языка от бэкенда:', lang);
      console.log('LanguageContext: текущий язык до установки:', language);
      setLanguage(lang);
      localStorage.setItem('language', lang);
      console.log('LanguageContext: язык установлен, localStorage обновлен');
      
      // Проверяем, что язык действительно изменился
      setTimeout(() => {
        console.log('LanguageContext: проверка через 100ms - текущий язык:', language);
      }, 100);
    } else {
      console.log('LanguageContext: ❌ Язык не поддерживается:', lang);
    }
  };

  // Настраиваем callback для получения языка ТОЛЬКО от бэкенда
  useEffect(() => {
    console.log('LanguageContext: useEffect запущен, setOnLanguageReceived:', !!setOnLanguageReceived);
    if (setOnLanguageReceived) {
      console.log('LanguageContext: ✅ Устанавливаем callback для получения языка от бэкенда');
      setOnLanguageReceived((backendLanguage) => {
        console.log('LanguageContext: получен язык от бэкенда:', backendLanguage);
        console.log('LanguageContext: доступные переводы:', Object.keys(translations));
        if (backendLanguage && translations[backendLanguage]) {
          console.log('LanguageContext: ✅ Устанавливаем язык от бэкенда:', backendLanguage);
          console.log('LanguageContext: текущий язык до изменения:', language);
          console.log('LanguageContext: время получения языка от бэкенда:', new Date().toLocaleTimeString());
          setLanguageFromBackend(backendLanguage);
          setIsLanguageInitialized(true);
          console.log('LanguageContext: язык установлен, инициализация завершена');
          
          // Принудительное обновление для гарантии смены языка
          setTimeout(() => {
            console.log('LanguageContext: принудительное обновление языка через 50ms');
            setLanguageFromBackend(backendLanguage);
          }, 50);
        } else {
          console.log('LanguageContext: ❌ Язык от бэкенда не поддерживается или пустой:', backendLanguage);
          setIsLanguageInitialized(true);
        }
      });
    } else {
      console.log('LanguageContext: setOnLanguageReceived не доступен');
    }
  }, [setOnLanguageReceived]);

  // Fallback: если через 5 секунд не получили язык от бэкенда, используем язык по умолчанию
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isLanguageInitialized) {
        console.log('LanguageContext: ⏰ Таймаут 5 секунд, язык не получен — используем русский по умолчанию');
        if (!language) {
          setLanguage('ru');
          localStorage.setItem('language', 'ru');
        }
        setIsLanguageInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [isLanguageInitialized, language]);

  // Если язык не установлен после инициализации, используем русский по умолчанию
  useEffect(() => {
    if (isLanguageInitialized && !language) {
      console.log('LanguageContext: язык не установлен, используем русский по умолчанию');
      setLanguage('ru');
      localStorage.setItem('language', 'ru');
    }
  }, [isLanguageInitialized, language]);

  if (!isLanguageInitialized) {
    // Блокируем рендер только до инициализации (максимум 5 секунд)
    return null;
  }

  // Если язык все еще null после инициализации, используем русский
  const currentLanguage = language || 'ru';

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, changeLanguage, t, isLanguageInitialized }}>
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