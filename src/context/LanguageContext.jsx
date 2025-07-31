import { createContext, useContext, useState, useEffect } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import { updateUserProfile, fetchUserProfile } from '../utils/api';

const translations = { ru, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru');
  
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

  const changeLanguage = async (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      
      // Отправляем обновление языка на бэкенд
      try {
        await updateUserProfile({ languageCode: lang });
      } catch (error) {
        console.warn('Ошибка обновления языка на сервере:', error);
        // Не прерываем смену языка локально, даже если сервер недоступен
      }
    }
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      // Сначала проверяем сохраненный язык в localStorage
      const savedLang = localStorage.getItem('language');
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
      }
      
      // Затем пытаемся получить язык с сервера (если пользователь авторизован)
      try {
        const userProfile = await fetchUserProfile();
        if (userProfile.value && userProfile.value.languageCode && translations[userProfile.value.languageCode]) {
          const serverLang = userProfile.value.languageCode;
          setLanguage(serverLang);
          localStorage.setItem('language', serverLang);
        }
      } catch (error) {
        // Игнорируем ошибки, если пользователь не авторизован или сервер недоступен
        console.warn('Не удалось получить язык с сервера:', error);
      }
    };

    initializeLanguage();
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