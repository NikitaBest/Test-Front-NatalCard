import { createContext, useContext, useState, useEffect } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import { useUser } from './UserContext';

const translations = { ru, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru');
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
      setLanguage(lang);
      localStorage.setItem('language', lang);
      // Язык будет отправлен вместе с остальными данными профиля
    }
  };

  // Настраиваем callback для получения языка от бэкенда ПЕРВЫМ
  useEffect(() => {
    console.log('LanguageContext: useEffect запущен, setOnLanguageReceived:', !!setOnLanguageReceived);
    if (setOnLanguageReceived) {
      console.log('LanguageContext: устанавливаем callback для получения языка от бэкенда');
      setOnLanguageReceived((backendLanguage) => {
        console.log('LanguageContext: получен язык от бэкенда:', backendLanguage);
        console.log('LanguageContext: доступные переводы:', Object.keys(translations));
        if (backendLanguage && translations[backendLanguage]) {
          console.log('LanguageContext: устанавливаем язык от бэкенда:', backendLanguage);
          console.log('LanguageContext: текущий язык до изменения:', language);
          setLanguage(backendLanguage);
          localStorage.setItem('language', backendLanguage);
          console.log('LanguageContext: язык установлен, localStorage обновлен');
          
          // Принудительно обновляем все компоненты, использующие язык
          setTimeout(() => {
            console.log('LanguageContext: принудительное обновление через 100ms');
            setLanguage(prevLang => {
              console.log('LanguageContext: принудительное обновление, предыдущий язык:', prevLang);
              return backendLanguage;
            });
          }, 100);
        } else {
          console.log('LanguageContext: язык от бэкенда не поддерживается или пустой, оставляем текущий');
        }
      });
    } else {
      console.log('LanguageContext: setOnLanguageReceived не доступен');
    }
  }, [setOnLanguageReceived]);

  // Инициализируем язык из localStorage ТОЛЬКО если нет языка от бэкенда
  useEffect(() => {
    const initializeLanguage = async () => {
      // Проверяем сохраненный язык в localStorage только как fallback
      const savedLang = localStorage.getItem('language');
      if (savedLang && translations[savedLang]) {
        console.log('LanguageContext: устанавливаем язык из localStorage:', savedLang);
        setLanguage(savedLang);
      } else {
        console.log('LanguageContext: нет сохраненного языка, оставляем по умолчанию (ru)');
      }
    };

    // Небольшая задержка, чтобы сначала установился callback для бэкенда
    setTimeout(initializeLanguage, 50);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
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