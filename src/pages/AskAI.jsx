import BottomMenu from '../components/BottomMenu';
import AskAITabs from '../components/AskAITabs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { sendAIMessage, getAIAnswer } from '../utils/api';
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

function HamburgerIcon() {
  return (
    <div className="flex flex-col justify-center items-center h-10 w-10">
      <span className="block w-7 h-0.5 bg-gray-400 mb-1.5 rounded" />
      <span className="block w-7 h-0.5 bg-gray-400 mb-1.5 rounded" />
      <span className="block w-7 h-0.5 bg-gray-400 rounded" />
    </div>
  );
}

export default function AskAI() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('self');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dialogStarted, setDialogStarted] = useState(false);
  const [chatId, setChatId] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  const getQuestions = () => {
    return t(`askAI.questions.${activeTab}`);
  };

  const handleQuestionClick = (q, idx) => {
    setSelectedQuestion(idx);
    setInputValue(q);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedQuestion(null);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    const now = new Date();
    const dateTime = now.toISOString();
    
    // Сразу добавляем сообщение пользователя в чат
    setMessages(prev => [...prev, {
      isUser: true,
      content: userMessage,
      createdAt: dateTime,
    }]);
    setInputValue('');
    setDialogStarted(true);
    
    // Начинаем загрузку
    setLoading(true);
    setError(null);
    
    try {
      // 1. Отправляем сообщение пользователя
      const data = await sendAIMessage(dateTime, chatId, userMessage);
      
      if (!data.value) throw new Error('Нет ответа от сервера');
      
      // Сохраняем chatId, если новый
      if (data.value.chatId && chatId !== data.value.chatId) setChatId(data.value.chatId);
      
      // 2. Получаем ответ ИИ
      const answerData = await getAIAnswer(data.value.createdAt, data.value.chatId);
      
      if (answerData.value && answerData.value.content) {
        setMessages(prev => [...prev, {
          isUser: false,
          content: answerData.value.content,
          createdAt: answerData.value.createdAt,
        }]);
      }
    } catch (e) {
      // Улучшенная обработка ошибок
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
    }
  };

  const handleBack = () => {
    setMessages([]);
    setDialogStarted(false);
    setInputValue('');
    setSelectedQuestion(null);
    setChatId(0);
    setError(null);
  };

  return (
    <div 
      className="min-h-screen bg-white pt-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <img
        src={bgImage}
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto z-0"
        style={{ opacity: 1, filter: 'drop-shadow(0 0 10px #000) brightness(0.5) contrast(2.5)' }}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="w-full flex flex-col items-center pb-[92px] flex-1 bg-white/80">
          <h1 className="text-2xl font-normal text-center mt-0 font-mono">{t('askAI.title')}</h1>
          <div className="flex flex-row items-center justify-start w-full max-w-xl mx-auto mb-2 px-4">
            <HamburgerIcon />
            <div className="text-left text-xs sm:text-sm md:text-base lg:text-lg font-normal text-gray-400 ml-4 w-[320px] truncate">{t('askAI.subtitle')}</div>
          </div>
          <hr className="w-[90%] mx-auto border-gray-300 mb-4" />
          {!dialogStarted && (
            <div className="mb-12">
              <AskAITabs active={activeTab} onChange={tab => { setActiveTab(tab); setInputValue(''); setSelectedQuestion(null); setDialogStarted(false); setMessages([]); setChatId(0); setError(null); }} />
            </div>
          )}
          {/* Вопросы только до начала диалога */}
          {!dialogStarted && (
            <div className="flex flex-col items-center w-full max-w-md mx-auto mb-8 px-4 overflow-fix" style={{ minHeight: '200px' }}>
              {getQuestions().map((q, i) => (
                <button
                  key={i}
                  className={`ask-ai-question font-mono text-base transition mb-8 focus:outline-none text-center w-full max-w-sm ${
                    selectedQuestion === i ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  onClick={() => handleQuestionClick(q, i)}
                  type="button"
                  style={{
                    lineHeight: '1.5',
                    padding: '8px 16px',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    display: 'block',
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {/* История диалога */}
          {dialogStarted && (
            <div className="flex flex-col items-center w-full max-w-md mx-auto mb-8">
              {messages.length > 0 && (
                <div className="w-full bg-white/80 rounded-xl shadow-none mb-8 px-4 py-6 flex flex-col gap-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      {msg.isUser ? (
                        <div className="rounded-xl px-4 py-3 max-w-[80%] text-base font-sans bg-black text-white">
                          {msg.content}
                        </div>
                      ) : (
                        <TypewriterEffect text={msg.content} formatText={formatText} />
                      )}
                    </div>
                  ))}
                  {/* Анимированное сообщение загрузки */}
                  {loading && <LoadingMessage />}
                </div>
              )}
              {error && <div className="text-center text-red-500 mb-4">{error}</div>}
              <button
                className="w-full max-w-[180px] h-10 bg-gray-200 text-gray-800 rounded-xl text-base font-mono mb-4"
                onClick={handleBack}
              >
                {t('askAI.exitChat')}
              </button>
            </div>
          )}
        </div>
        <div className="fixed left-0 right-0 bottom-[55px] z-50 w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-md mx-auto px-2 pointer-events-auto">
            <div className="flex items-center border-t border-gray-300 bg-white">
              <input
                className="flex-1 py-5 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
                placeholder={dialogStarted ? t('askAI.messagePlaceholder') : t('askAI.placeholder')}
                value={inputValue}
                onChange={handleInputChange}
                disabled={loading}
                onKeyDown={e => { if (e.key === 'Enter' && !dialogStarted) handleSend(); }}
              />
              <button className="p-2 flex items-center justify-center" type="button" onClick={handleSend} disabled={!inputValue.trim() || loading}>
                {inputValue.trim() ? (
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="14" fill="#1A1A1A"/>
                    <path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="14" fill="#F3F4F6"/>
                    <path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <BottomMenu activeIndex={1} />
      </div>
    </div>
  );
} 