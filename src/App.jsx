import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Splash from './pages/Splash';
import Start from './pages/Start';
import Name from './pages/Name';
import Gender from './pages/Gender';
import BirthDate from './pages/BirthDate';
import BirthTime from './pages/BirthTime';
import BirthCity from './pages/BirthCity';
import AskAI from './pages/AskAI';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Today from './pages/Today';
import { AnimatePresence, motion } from 'framer-motion';
import { loginUser } from './utils/api';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setTimeout(() => setShowSplash(false), 500); // 500ms for fade out
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Telegram WebApp настройки
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.expand && tg.expand();
        tg.disableClosingConfirmation && tg.disableClosingConfirmation();
        tg.disableVerticalSwipes && tg.disableVerticalSwipes();
        tg.lockOrientation && tg.lockOrientation();
      } catch (e) {
        // Не критично, если что-то не поддерживается
        console.warn('Telegram WebApp API error:', e);
      }
    }
    // Авторизация при первом запуске, если токена нет
    const token = localStorage.getItem('token');
    if (!token) {
      // Пытаемся получить данные из Telegram Web App
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
          userTelegramId: 888443,
          firstName: 'string',
          lastName: 'string',
          userName: 'string',
          photoUrl: 'http://localhost:5173/123.jpeg',
          initData: 'string',
          ignoreValidate: true,
        };
      }
      
      loginUser(userData)
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          if (data.user) {
            localStorage.setItem('userId', data.user.id);
            // Не сохраняем localStorage.user здесь!
          }
        })
        .catch((err) => {
          // Можно добавить обработку ошибок
          console.error('Ошибка авторизации:', err);
        });
    }
  }, []);

  return (
    <>
      {showSplash && <Splash fadeOut={!isAppLoading} />}
      {!showSplash && (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ height: '100%' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/start" replace />} />
              <Route path="/start" element={<Start />} />
              <Route path="/name" element={<Name />} />
              <Route path="/gender" element={<Gender />} />
              <Route path="/birth-date" element={<BirthDate />} />
              <Route path="/birth-time" element={<BirthTime />} />
              <Route path="/birth-city" element={<BirthCity />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/today" element={<Today />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
export default App;
