import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loginUser } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    birthLocation: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  const onLanguageReceivedRef = useRef(null);

  // Функция проверки заполненности профиля
  const checkProfileFilled = (user) => {
    return (
      user &&
      typeof user.name === 'string' && user.name.trim() &&
      typeof user.birthDate === 'string' && user.birthDate.trim() &&
      typeof user.birthTime === 'string' && user.birthTime.trim() &&
      typeof user.birthLocation === 'string' && user.birthLocation.trim()
    );
  };

  // Проверка авторизации через бекенд при каждом открытии/обновлении приложения
  useEffect(() => {
    console.log('UserContext: useEffect запущен, начинаем авторизацию');
    console.log('UserContext: onLanguageReceived callback доступен:', !!onLanguageReceivedRef.current);
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Пытаемся получить данные из Telegram Web App
        const tg = window.Telegram?.WebApp;
        let userData;
        
        if (tg && tg.initDataUnsafe?.user) {
          // Данные из Telegram Web App
          const user = tg.initDataUnsafe.user;
          userData = {
            userTelegramId: user.id,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            userName: user.username || '',
            photoUrl: user.photo_url || '',
            initData: tg.initData || '',
            ignoreValidate: true,
          };
        } else {
          // Fallback - тестовые данные
          userData = {
            userTelegramId: 88888802,
            firstName: 'string',
            lastName: 'string',
            userName: 'string',
            photoUrl: 'http://localhost:5173/123.jpeg',
            initData: 'string',
            ignoreValidate: true,
          };
        }
        
        // Ждем, пока LanguageContext установит callback
        let attempts = 0;
        while (!onLanguageReceivedRef.current && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
          console.log(`UserContext: ждем callback, попытка ${attempts}/50, callback доступен:`, !!onLanguageReceivedRef.current);
        }
        
        if (!onLanguageReceivedRef.current) {
          console.log('UserContext: ⚠️ Callback не установлен после 50 попыток, продолжаем без смены языка');
        } else {
          console.log('UserContext: ✅ Callback установлен, продолжаем с авторизацией');
        }
        
        // Всегда делаем авторизацию через бекенд
        console.log('UserContext: отправляем запрос на логин...');
        const data = await loginUser(userData);
        console.log('UserContext: получен ответ от бэкенда:', data);
        console.log('UserContext: время получения ответа:', new Date().toLocaleTimeString());
        console.log('UserContext: полный объект user:', JSON.stringify(data.user, null, 2));
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUserData(data.user);
          setIsProfileFilled(checkProfileFilled(data.user));
          
          // Проверяем, есть ли язык в ответе бэкенда
          console.log('UserContext: проверяем languageCode:', data.user.languageCode);
          console.log('UserContext: onLanguageReceived callback:', !!onLanguageReceivedRef.current);
          console.log('UserContext: тип languageCode:', typeof data.user.languageCode);
          console.log('UserContext: значение languageCode:', JSON.stringify(data.user.languageCode));
          
          if (data.user.languageCode && onLanguageReceivedRef.current) {
            console.log('UserContext: ✅ Вызываем onLanguageReceived с языком:', data.user.languageCode);
            onLanguageReceivedRef.current(data.user.languageCode);
            console.log('UserContext: ✅ onLanguageReceived вызван успешно');
          } else {
            console.log('UserContext: ❌ НЕ вызываем onLanguageReceived. Причина:', {
              hasLanguageCode: !!data.user.languageCode,
              hasCallback: !!onLanguageReceivedRef.current,
              languageCodeValue: data.user.languageCode,
              languageCodeType: typeof data.user.languageCode
            });
          }
        } else {
          // Если нет данных пользователя, устанавливаем пустые данные
          setUserData({
            name: '',
            gender: '',
            birthDate: '',
            birthTime: '',
            birthLocation: ''
          });
          setIsProfileFilled(false);
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        // При ошибке устанавливаем пустые данные
        setUserData({
          name: '',
          gender: '',
          birthDate: '',
          birthTime: '',
          birthLocation: ''
        });
        setIsProfileFilled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Слушаем изменения localStorage (например, если другой вкладкой обновили)
  useEffect(() => {
    function syncUserData(e) {
      if (e.key === 'user') {
        const newUserData = e.newValue ? JSON.parse(e.newValue) : {};
        setUserData(newUserData);
        setIsProfileFilled(checkProfileFilled(newUserData));
      }
    }
    window.addEventListener('storage', syncUserData);
    return () => window.removeEventListener('storage', syncUserData);
  }, []);

  const resetProfile = () => {
    setUserData({
      name: '',
      gender: '',
      birthDate: '',
      birthTime: '',
      birthLocation: ''
    });
    setIsProfileFilled(false);
  };

  const setOnLanguageReceived = (callback) => {
    onLanguageReceivedRef.current = callback;
    console.log('UserContext: setOnLanguageReceived вызван, callback установлен:', !!callback);
  };

  const value = { 
    userData, 
    setUserData, 
    isLoading, 
    isProfileFilled,
    resetProfile,
    setOnLanguageReceived
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
