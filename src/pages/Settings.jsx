import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelect from '../components/LanguageSelect';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIChats } from '../utils/api';
import bgImage from '../assets/bg2.png';

// Импортируем функцию getHeaders из api.js
function getHeaders() {
  const token = localStorage.getItem('token');
  const language = localStorage.getItem('language') || 'ru';
  
  const headers = {
    'accept': 'application/json',
    'Accept-Language': language,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}



export default function Settings() {
  const { userData, setUserData } = useUser();
  const { t, language, changeLanguage } = useLanguage();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  // Функция для получения правильного множественного числа чатов
  const getChatPluralTranslated = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return t('settings.chats');
    }
    if (lastDigit === 1) {
      return t('settings.chat');
    }
    if ([2, 3, 4].includes(lastDigit)) {
      return t('settings.chata');
    }
    return t('settings.chats');
  };

  // Загружаем чаты сразу при заходе на страницу (для отображения количества)
  useEffect(() => {
    async function fetchChats() {
      setLoadingChats(true);
      setError(null);
      try {
        const data = await getAIChats();
        setChats(data.value || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingChats(false);
      }
    }
    fetchChats();
  }, []);





  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex-grow overflow-y-auto pt-10 pb-24 relative">
        <img
          src={bgImage}
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto z-0"
          style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
        />
        <div className="relative z-10 px-4">
          <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('settings.title')}</h1>
          <hr className="w-full mx-auto border-gray-300 my-4" />
          <h2 className="text-center text-lg font-normal text-gray-700 mb-8 font-mono">{t('settings.userProfile')}</h2>
          <div className="w-full bg-[#fafbfc] shadow-sm mb-8 border border-gray-200 rounded-lg">
            {[
              { label: t('settings.name'), value: userData.name || '' },
              { label: t('settings.username'), value: userData.userName ? `@${userData.userName}` : '@username' },
              { label: t('settings.gender'), value: (userData.gender === 1 || userData.gender === 'male') ? t('settings.male') : (userData.gender === 2 || userData.gender === 'female') ? t('settings.female') : '' },
              { label: t('settings.birthDate'), value: userData.birthDate || '' },
              { label: t('settings.birthTime'), value: userData.birthTime || '' },
              { label: t('settings.birthPlace'), value: userData.birthLocation || userData.birthCity || userData.birth_city || '' },
            ].map((row, idx) => (
              <div key={row.label} className="flex justify-between items-center px-4 py-3 border-b border-gray-300 text-sm font-mono text-gray-700 last:border-b-0">
                <span className="text-left font-normal flex-1 pr-2">{row.label}</span>
                <span className="text-right font-normal flex-1 break-words">{row.value}</span>
              </div>
            ))}
            {/* История чата — отдельная строка */}
            <button
              className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-300 text-sm font-mono text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
              onClick={() => navigate('/chat-history')}
            >
              <span className="text-left font-normal flex-1">{t('settings.chatHistory')}</span>
              <div className="flex items-center space-x-2">
                <span className="text-right font-normal text-gray-400">{loadingChats ? '...' : chats.length ? `${chats.length} ${getChatPluralTranslated(chats.length)}` : ''}</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-gray-400">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            {/* Язык — отдельная строка */}
            <div className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-300 text-sm font-mono text-gray-700">
              <span className="text-left font-normal flex-1">{t('settings.language')}</span>
              <div className="text-right font-normal flex-1 flex justify-end">
                <LanguageSelect variant="compact" />
              </div>
            </div>
          </div>
          {/* Кнопка изменить данные */}
          <div className="px-2">
            <button
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl text-base font-mono flex items-center justify-center"
              onClick={() => setShowModal(true)}
            >
              {t('settings.editData')}
            </button>
          </div>
        </div>
      </div>
      {/* Модалка подтверждения */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col items-center">
            <div className="text-lg font-normal text-center mb-8 font-mono">{t('settings.confirmEditData')}</div>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl text-base font-mono hover:bg-gray-200 transition-colors"
                onClick={() => setShowModal(false)}
              >
                {t('common.no')}
              </button>
              <button
                className="flex-1 py-3 px-6 bg-black text-white rounded-xl text-base font-mono hover:bg-gray-800 transition-colors"
                onClick={() => {
                  localStorage.removeItem('user');
                  setUserData({ name: '', gender: '', birthDate: '', birthTime: '', birthLocation: '' });
                  setShowModal(false);
                  navigate('/name');
                }}
              >
                {t('common.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomMenu activeIndex={0} isNavigationDisabled={keyboardVisible} />
    </div>
  );
}

