import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Start from './pages/Start';
import LanguageSelect from './pages/LanguageSelect';
import Name from './pages/Name';
import Gender from './pages/Gender';
import BirthDate from './pages/BirthDate';
import BirthTime from './pages/BirthTime';
import BirthCity from './pages/BirthCity';
import AskAI from './pages/AskAI';
import Settings from './pages/Settings';
import ChatHistory from './pages/ChatHistory';
import Profile from './pages/Profile';
import Today from './pages/Today';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from './context/UserContext';
import { trackPageView, trackNavigation } from './utils/yandexMetrika';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { isLoading, isProfileFilled } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setTimeout(() => setShowSplash(false), 500); // 500ms for fade out
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Проверяем профиль и делаем редирект если он заполнен
  useEffect(() => {
    if (!isLoading && isProfileFilled && showSplash) {
      // Если профиль заполнен и мы еще на сплэше, редиректим на профиль
      setTimeout(() => {
        setShowSplash(false);
        navigate('/profile');
      }, 1000); // Небольшая задержка чтобы пользователь увидел анимацию
    }
  }, [isLoading, isProfileFilled, showSplash, navigate]);

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
  }, []);

  // Отслеживание переходов между страницами для Яндекс.Метрики
  useEffect(() => {
    if (!showSplash && location.pathname) {
      const pageName = location.pathname.replace('/', '') || 'home';
      trackPageView(location.pathname, pageName);
      trackNavigation(pageName, { path: location.pathname });
    }
  }, [location.pathname, showSplash]);

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
              <Route path="/" element={<Navigate to={isProfileFilled ? "/profile" : "/language-select"} replace />} />
              <Route path="/language-select" element={<LanguageSelect />} />
              <Route path="/start" element={<Start />} />
              <Route path="/name" element={<Name />} />
              <Route path="/gender" element={<Gender />} />
              <Route path="/birth-date" element={<BirthDate />} />
              <Route path="/birth-time" element={<BirthTime />} />
              <Route path="/birth-city" element={<BirthCity />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat-history" element={<ChatHistory />} />
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
