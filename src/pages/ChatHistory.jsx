import BottomMenu from '../components/BottomMenu';
import ChatInput from '../components/ChatInput';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAIChats, getAIChatHistory, sendAIMessage, getAIAnswer, checkAIAnswerReady } from '../utils/api';
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


// Компонент эффекта печатания
function TypewriterEffect({ text, onComplete, formatText }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Скорость печатания (15ms на символ - в 2 раза быстрее)

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
    }, 2500);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

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

export default function ChatHistory() {
  const { t } = useLanguage();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isCheckingReadiness, setIsCheckingReadiness] = useState(false);
  const [error, setError] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  // Хук для отслеживания виртуальной клавиатуры
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                     ('ontouchstart' in window);
    
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      
      if (visualViewport && isMobile) {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        const viewportHeight = visualViewport.height;
        const screenHeight = window.innerHeight;
        const shouldHideMenu = keyboardHeight > 100 || (screenHeight - viewportHeight) > 50;
        setKeyboardVisible(shouldHideMenu);
      } else if (isMobile && !visualViewport) {
        const currentHeight = window.innerHeight;
        const shouldHideMenu = currentHeight < window.screen.height * 0.8;
        setKeyboardVisible(shouldHideMenu);
      } else {
        setKeyboardVisible(false);
      }
    };

    if (window.visualViewport && isMobile) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Функция для форматирования текста
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.\s)/g, '<br><strong>$1</strong>')
      .replace(/([.!?])\s+/g, '$1<br><br>')
      .replace(/<br><br><br>/g, '<br><br>');
  };

  // Загружаем чаты сразу при заходе на страницу
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

  // Загрузка истории чата
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





  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <img
        src={bgImage}
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto z-0"
        style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
      />
      {/* Фиксированная шапка только если не выбран чат */}
      {!selectedChat && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full">
          <div className="flex items-center px-4 py-2 border-b border-gray-300">
            <button
              className="mr-2 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => navigate('/settings')}
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
      <div className="w-full overflow-hidden pb-[56px] pt-[70px]"
           style={{
             paddingBottom: keyboardVisible ? '140px' : '135px',
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
              <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full">
                <div className="flex items-center px-4 py-2 border-b border-gray-300">
                  <button
                    className="mr-2 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => selectedChat ? setSelectedChat(null) : navigate('/settings')}
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
              <ChatMessagesList messages={messages} loading={loadingHistory} loadingAI={loadingAI} isCheckingReadiness={isCheckingReadiness} formatText={formatText} />
              {/* Фиксированное поле ввода */}
              <div className="fixed left-0 right-0 z-[9999] w-full flex justify-center pointer-events-none px-2"
                   style={{
                     bottom: keyboardVisible ? '70px' : '61px',
                     transition: 'bottom 0.3s ease-in-out'
                   }}>
                <div className="w-full pointer-events-auto">
                  <ChatInputSection 
                    chatId={selectedChat.id} 
                    onMessageSent={msg => setMessages(prev => [...prev, msg])} 
                    disabled={loadingHistory} 
                    formatText={formatText}
                    onLoadingChange={setLoadingAI}
                    onCheckingReadinessChange={setIsCheckingReadiness}
                    keyboardVisible={keyboardVisible}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomMenu activeIndex={0} isNavigationDisabled={keyboardVisible} />
    </div>
  );
}

// --- ChatInputSection ---
function ChatInputSection({ chatId, onMessageSent, disabled, formatText, onLoadingChange, onCheckingReadinessChange, keyboardVisible }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckingReadiness, setIsCheckingReadiness] = useState(false);

  // Функция для проверки готовности ответа ИИ
  const checkAnswerReadiness = async (currentChatId) => {
    try {
      const isReady = await checkAIAnswerReady(currentChatId);
      return isReady;
    } catch (err) {
      console.error('Ошибка проверки готовности ответа ИИ:', err);
      return false;
    }
  };

  // Функция для получения ответа ИИ
  const fetchAIAnswer = async (dateTime, currentChatId) => {
    try {
      const answerData = await getAIAnswer(dateTime, currentChatId);
      
      if (answerData.value && answerData.value.content) {
        const aiMessage = {
          isUser: false,
          content: answerData.value.content,
          createdAt: answerData.value.createdAt,
          isNew: true,
        };
        onMessageSent(aiMessage);
      }
    } catch (e) {
      throw e;
    }
  };

  // Основная логика проверки готовности и получения ответа
  const startAnswerLoading = async (dateTime, currentChatId) => {
    setIsCheckingReadiness(true);
    onCheckingReadinessChange?.(true);
    
    const checkInterval = setInterval(async () => {
      try {
        const isReady = await checkAnswerReadiness(currentChatId);
        
        if (isReady) {
          console.log('AI answer is ready, stopping checks and loading data');
          clearInterval(checkInterval);
          setIsCheckingReadiness(false);
          onCheckingReadinessChange?.(false);
          await fetchAIAnswer(dateTime, currentChatId);
        }
      } catch (err) {
        console.error('Ошибка при проверке готовности ответа ИИ:', err);
      }
    }, 4000);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (isCheckingReadiness) {
        setIsCheckingReadiness(false);
        onCheckingReadinessChange?.(false);
        setError('Превышено время ожидания ответа ИИ');
        setLoading(false);
        onLoadingChange?.(false);
      }
    }, 300000);
  };

  const handleSend = async (message) => {
    if (!message || !message.trim()) return;
    
    const userMessage = message.trim();
    const now = new Date();
    const dateTime = now.toISOString();
    
    const userMessageObj = {
      isUser: true,
      content: userMessage,
      createdAt: dateTime,
    };
    onMessageSent(userMessageObj);
    
    setLoading(true);
    onLoadingChange?.(true);
    setError(null);
    
    try {
      const data = await sendAIMessage(dateTime, chatId, userMessage);
      if (!data.value) throw new Error('Нет ответа от сервера');
      
      await startAnswerLoading(data.value.createdAt, chatId);
      
    } catch (e) {
      // Улучшенная обработка ошибок (как в AskAI.jsx)
      let errorMessage = 'Произошла ошибка при обработке запроса';
      
      if (e.message.includes('превысил время ожидания') || e.message.includes('timeout')) {
        errorMessage = 'Сервер долго отвечает. Попробуйте еще раз через минуту.';
      } else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        errorMessage = 'Проблема с подключением к серверу. Проверьте интернет и попробуйте снова.';
      } else if (e.message.includes('Ошибка отправки сообщения')) {
        errorMessage = 'Не удалось отправить сообщение. Попробуйте еще раз.';
      } else if (e.message.includes('Ошибка получения ответа ИИ')) {
        errorMessage = 'ИИ обрабатывает ваш вопрос. Попробуйте еще раз через минуту.';
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <ChatInput
      onSend={handleSend}
      placeholder={t('settings.messagePlaceholder')}
      disabled={disabled}
      loading={loading}
      isCheckingReadiness={isCheckingReadiness}
      keyboardVisible={keyboardVisible}
      size="small"
      error={error}
    />
  );
}

// --- ChatMessagesList ---
function ChatMessagesList({ messages, loading, loadingAI, isCheckingReadiness, formatText }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="w-full px-4 py-6 flex flex-col gap-6 overflow-y-auto"
      style={{
        maxHeight: 'calc(100vh - 180px)',
        minHeight: '200px',
        marginBottom: '0px',
        paddingBottom: '120px',
        paddingTop: '80px',
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
          {(loadingAI || isCheckingReadiness) && <LoadingMessage />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

