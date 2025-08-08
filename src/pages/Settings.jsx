import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelect from '../components/LanguageSelect';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAIChats, getAIChatHistory, sendAIMessage, getAIAnswer } from '../utils/api';
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

// Компонент анимированных точек загрузки
function LoadingDots() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-gray-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Компонент эффекта печатания
function TypewriterEffect({ text, onComplete, formatText }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Скорость печатания (30ms на символ)

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className="rounded-xl px-4 py-3 max-w-[80%] text-base font-sans bg-gray-100 text-gray-900">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatText(displayedText) 
        }}
      />
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}

// Компонент анимированного сообщения загрузки
function LoadingMessage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');
  
  const loadingSteps = [
    { text: t('askAI.loading.thinking'), symbol: '●' },
    { text: t('askAI.loading.analyzing'), symbol: '◆' },
    { text: t('askAI.loading.chart'), symbol: '▲' },
    { text: t('askAI.loading.planets'), symbol: '◉' },
    { text: t('askAI.loading.aspects'), symbol: '○' },
    { text: t('askAI.loading.forming'), symbol: '◇' }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500); // Уменьшил время для более динамичной смены

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400); // Ускорил анимацию точек

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotsInterval);
    };
  }, [loadingSteps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="rounded-xl px-4 py-3 max-w-[80%] text-sm font-sans bg-gray-50 text-gray-500 border border-gray-200">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <motion.span
            key={`symbol-${currentStep}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base text-gray-400"
          >
            {loadingSteps[currentStep].symbol}
          </motion.span>
          <span className="font-mono text-gray-500 text-sm">
            {loadingSteps[currentStep].text.replace('и три точки', dots).replace('and three dots', dots)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Settings() {
  const { userData, setUserData } = useUser();
  const { t, language, changeLanguage } = useLanguage();
  const [showChatList, setShowChatList] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  // Хук для отслеживания виртуальной клавиатуры
  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        setKeyboardVisible(keyboardHeight > 150); // Если клавиатура больше 150px
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      // Fallback для браузеров без visualViewport
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Функция для форматирования текста
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Заменяем **текст** на <strong>
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Заменяем *текст* на <em>
      .replace(/\n/g, '<br>') // Заменяем переносы строк на <br>
      .replace(/(\d+\.\s)/g, '<br><strong>$1</strong>') // Форматируем нумерованные списки
      .replace(/([.!?])\s+/g, '$1<br><br>') // Добавляем двойные переносы после предложений
      .replace(/<br><br><br>/g, '<br><br>'); // Убираем лишние переносы
  };

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

  // Загрузка истории чата (оставляем как было)
  useEffect(() => {
    if (!selectedChat) return;
    async function fetchHistory() {
      setLoadingHistory(true);
      setError(null);
      try {
        const data = await getAIChatHistory(selectedChat.id);
        setMessages(data.value || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [selectedChat]);

  // Формат даты
  function formatDate(dateStr) {
    if (!dateStr || dateStr === '0001-01-01T00:00:00') return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  // UI: История чатов
  if (showChatList) {
    return (
      <div className="min-h-screen bg-white pt-10 relative overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto z-0"
          style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
        />
        {/* Фиксированная шапка только если не выбран чат */}
        {!selectedChat && (
          <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full mt-4">
            <div className="flex items-center px-4 py-2 border-b border-gray-300">
              <button
                className="mr-2 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => setShowChatList(false)}
                aria-label="Назад"
                type="button"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M13 16l-5-5 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h2 className="flex-1 text-center text-2xl font-normal text-gray-900">{t('settings.chatHistoryTitle')}</h2>
              <div className="w-9" />
            </div>
          </div>
        )}
        {/* Список чатов */}
        <div className="w-full overflow-hidden pb-[56px] pt-[60px]"
             style={{
               paddingBottom: keyboardVisible ? '120px' : '115px', // Вплотную к меню без клавиатуры
               transition: 'padding-bottom 0.3s ease-in-out'
             }}>
          {error && <div className="text-red-500 text-center py-4 px-4">{error}</div>}
          <AnimatePresence mode="wait">
            {!selectedChat && (
              <motion.div
                key="chat-list"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
              >
                {loadingChats ? (
                  <div className="text-center py-8">Загрузка чатов...</div>
                ) : (
                  chats.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">Нет чатов</div>
                  ) : (
                    <div className="flex flex-col divide-y divide-gray-300">
                      {chats.map((chat, idx) => (
                        <button
                          key={chat.id}
                          className="w-full flex justify-between items-center px-4 py-4 text-sm font-mono text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setSelectedChat(chat)}
                        >
                          <span
                            className="text-left font-normal overflow-hidden text-ellipsis whitespace-normal flex-1 pr-2"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {chat.mainQuestion || `Вопрос ${idx + 1}`}
                          </span>
                          <span className="text-right font-normal text-gray-400 text-xs flex-shrink-0">{formatDate(chat.lastMessageTime)}</span>
                        </button>
                      ))}
                    </div>
                  )
                )}
              </motion.div>
            )}
            {selectedChat && (
              <motion.div
                key="chat-history"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Фиксированная шапка */}
                <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full mt-4">
                  <div className="flex items-center px-4 py-2 border-b border-gray-300">
                    <button
                      className="mr-2 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() => selectedChat ? setSelectedChat(null) : setShowChatList(false)}
                      aria-label="Назад"
                      type="button"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path d="M13 16l-5-5 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h2 className="flex-1 text-center text-2xl font-normal text-gray-900">{t('settings.chatHistoryTitle')}</h2>
                    <div className="w-9" />
                  </div>
                </div>
                {/* Контейнер сообщений */}
                <ChatMessagesList messages={messages} loading={loadingHistory} loadingAI={loadingAI} formatText={formatText} />
                {/* Фиксированное поле ввода */}
                <div className="fixed left-0 right-0 z-50 w-full flex justify-center pointer-events-none px-2"
                     style={{
                       bottom: keyboardVisible ? '60px' : '55px', // Вплотную к меню без клавиатуры
                       transition: 'bottom 0.3s ease-in-out'
                     }}>
                  <div className="w-full pointer-events-auto">
                    <ChatInputSection 
                      chatId={selectedChat.id} 
                      onMessageSent={msg => setMessages(prev => [...prev, msg])} 
                      disabled={loadingHistory} 
                      formatText={formatText}
                      onLoadingChange={setLoadingAI}
                      keyboardVisible={keyboardVisible}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <BottomMenu activeIndex={0} />
      </div>
    );
  }

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
              onClick={() => setShowChatList(true)}
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
      <BottomMenu activeIndex={0} />
    </div>
  );
}

// --- ChatInputSection ---
function ChatInputSection({ chatId, onMessageSent, disabled, formatText, onLoadingChange, keyboardVisible }) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    const now = new Date();
    const dateTime = now.toISOString();
    
    // Сразу добавляем сообщение пользователя в чат
    const userMessageObj = {
      isUser: true,
      content: userMessage,
      createdAt: dateTime,
    };
    onMessageSent(userMessageObj);
    setInputValue("");
    
    // Начинаем загрузку
    setLoading(true);
    onLoadingChange?.(true);
    setError(null);
    
    try {
      // Отправляем сообщение пользователя
      const data = await sendAIMessage(dateTime, chatId, userMessage);
      if (!data.value) throw new Error('Нет ответа от сервера');
      
      // Получаем ответ ИИ
      const answerData = await getAIAnswer(data.value.createdAt, chatId);
      if (answerData.value && answerData.value.content) {
        // Добавляем ответ ИИ как новое сообщение (будет печататься)
        const aiMessage = {
          isUser: false,
          content: answerData.value.content,
          createdAt: answerData.value.createdAt,
          isNew: true, // Помечаем как новое сообщение
        };
        onMessageSent(aiMessage);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div className="flex items-center border-t border-gray-300 bg-white rounded-t-xl shadow-lg"
         style={{
           paddingBottom: keyboardVisible ? '10px' : '0px',
           transition: 'padding-bottom 0.3s ease-in-out'
         }}>
      <input
        className="flex-1 py-4 px-3 text-sm font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
        placeholder={t('settings.messagePlaceholder')}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        disabled={loading || disabled}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
      />
      <button className="p-2 flex items-center justify-center" type="button" onClick={handleSend} disabled={!inputValue.trim() || loading || disabled}>
        {inputValue.trim() ? (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1A1A1A"/>
            <path d="M9 12h6m0 0-2-2m2 2-2 2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#F3F4F6"/>
            <path d="M9 12h6m0 0-2-2m2 2-2 2" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      {error && <div className="text-red-500 text-xs ml-2 px-2">{error}</div>}
    </div>
  );
}

// --- ChatMessagesList ---
function ChatMessagesList({ messages, loading, loadingAI, formatText }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Автоскролл к последнему сообщению
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="w-full px-4 py-6 flex flex-col gap-6 overflow-y-auto"
      style={{
        maxHeight: 'calc(100vh - 180px)', // Увеличил отступ
        minHeight: '200px',
        marginBottom: '0px',
        paddingBottom: '120px', // Уменьшил отступ чтобы поле было вплотную к меню
        paddingTop: '70px',
      }}
    >
      {loading ? (
        <div className="text-center py-8">Загрузка истории...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Нет сообщений в чате</div>
      ) : (
        <>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              {msg.isUser ? (
                <div className="rounded-xl px-3 py-2 max-w-[85%] text-sm font-sans bg-black text-white">
                  {msg.content}
                </div>
              ) : msg.isNew ? (
                <TypewriterEffect text={msg.content} formatText={formatText} />
              ) : (
                <div className="rounded-xl px-3 py-2 max-w-[85%] text-sm font-sans bg-gray-100 text-gray-900">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatText(msg.content) 
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          {/* Анимированное сообщение загрузки */}
          {loadingAI && <LoadingMessage />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}