import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileFilled, setIsProfileFilled] = useState(false);

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
            userTelegramId: 99988877766612,
            firstName: 'string',
            lastName: 'string',
            userName: 'string',
            photoUrl: 'http://localhost:5173/123.jpeg',
            initData: 'string',
            ignoreValidate: true,
          };
        }
        
        // Всегда делаем авторизацию через бекенд
        const data = await loginUser(userData);
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUserData(data.user);
          setIsProfileFilled(checkProfileFilled(data.user));
        } else {
          // Если нет данных пользователя, устанавливаем пустые данные
          setUserData({
            name: '',
            gender: '',
            birthDate: '',
            birthTime: '',
            birthCity: ''
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
          birthCity: ''
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

  const value = { 
    userData, 
    setUserData, 
    isLoading, 
    isProfileFilled 
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
