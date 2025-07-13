import BottomMenu from '../components/BottomMenu';
import AskAITabs from '../components/AskAITabs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
function TypewriterEffect({ text, onComplete }) {
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
      {displayedText}
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

const QUESTIONS = {
  career: [
    'Как подобрать профессию?',
    'Что меня ждет?',
    'Какая сфера деятельности мне подойдёт?',
    'Составь план для карьерного роста',
    'Как развить навыки?'
  ],
  self: [
    'С чего мне начать?',
    'Стоит ли идти этой дорогой?',
    'Какая сфера деятельности мне подойдёт?',
    'Составь план на будущее',
    'Как развить дисциплину?',
  ],
  love: [
    'Как построить гармоничные отношения?',
    'Что мешает мне встретить любовь?',
    'Как понять свои чувства?',
    'Как наладить отношения с партнёром?'
  ]
};

export default function AskAI() {
  const [activeTab, setActiveTab] = useState('self');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // {isUser, content, createdAt}
  const [chatId, setChatId] = useState(0); // 0 для нового чата
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dialogStarted, setDialogStarted] = useState(false);

  const handleQuestionClick = (q, idx) => {
    setInputValue(q);
    setSelectedQuestion(idx);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedQuestion(null);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const now = new Date();
    const dateTime = now.toISOString();
    try {
      // 1. Отправляем сообщение пользователя
      const res = await fetch('https://astro-backend.odonta.burtimaxbot.ru/ai-chat/send-message', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateTime,
          chatId,
          content: inputValue.trim(),
        })
      });
      if (!res.ok) throw new Error('Ошибка отправки сообщения');
      const data = await res.json();
      if (!data.value) throw new Error('Нет ответа от сервера');
      // Сохраняем chatId, если новый
      if (data.value.chatId && chatId !== data.value.chatId) setChatId(data.value.chatId);
      // Добавляем сообщение пользователя в историю
      setMessages(prev => [...prev, {
        isUser: true,
        content: inputValue.trim(),
        createdAt: data.value.createdAt,
      }]);
      setInputValue('');
      setDialogStarted(true);
      // 2. Получаем ответ ИИ
      const answerRes = await fetch(`https://astro-backend.odonta.burtimaxbot.ru/ai-chat/answer?dateTime=${encodeURIComponent(data.value.createdAt)}&chatId=${data.value.chatId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!answerRes.ok) throw new Error('Ошибка получения ответа ИИ');
      const answerData = await answerRes.json();
      if (answerData.value && answerData.value.content) {
        setMessages(prev => [...prev, {
          isUser: false,
          content: answerData.value.content,
          createdAt: answerData.value.createdAt,
        }]);
      }
    } catch (e) {
      setError(e.message);
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
    <div className="min-h-screen pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 1, filter: 'drop-shadow(0 0 10px #000) brightness(0.5) contrast(2.5)' }}
      />
      <div className="bg-white/50 relative z-10 min-h-screen">
        {loading && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingDots />
            </motion.div>
          </AnimatePresence>
        )}
        <div className="w-full flex flex-col items-center pb-[92px]">
          <h1 className="text-2xl font-normal text-center mt-2 font-mono">Вопрос&nbsp;AI</h1>
          <div className="flex flex-row items-center justify-start w-full max-w-xl mx-auto mb-2 px-4">
            <HamburgerIcon />
            <div className="text-left text-xs sm:text-sm md:text-base lg:text-lg font-normal text-gray-400 ml-4 w-[320px] truncate">Получи ответы на самые важные вопросы</div>
          </div>
          <hr className="w-[90%] mx-auto border-gray-300 mb-4" />
          {!dialogStarted && (
            <div className="mb-12">
              <AskAITabs active={activeTab} onChange={tab => { setActiveTab(tab); setInputValue(''); setSelectedQuestion(null); setDialogStarted(false); setMessages([]); setChatId(0); setError(null); }} />
            </div>
          )}
          {/* Вопросы только до начала диалога */}
          {!dialogStarted && (
            <div className="flex flex-col items-center w-full max-w-md mx-auto mb-8">
              {QUESTIONS[activeTab].map((q, i) => (
                <button
                  key={i}
                  className={`font-mono text-base transition mb-10 focus:outline-none ${
                    selectedQuestion === i ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  onClick={() => handleQuestionClick(q, i)}
                  type="button"
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
                        <TypewriterEffect text={msg.content} />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {error && <div className="text-center text-red-500 mb-4">{error}</div>}
              <button
                className="w-full max-w-[180px] h-10 bg-gray-200 text-gray-800 rounded-xl text-base font-mono mb-4"
                onClick={handleBack}
              >
                Выйти из чата
              </button>
            </div>
          )}
        </div>
        <div className="fixed left-0 right-0 bottom-[45px] z-50 w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-md mx-auto px-2 pointer-events-auto">
            <div className="flex items-center border-t border-gray-300 bg-white">
              <input
                className="flex-1 py-5 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
                placeholder={dialogStarted ? "Введите сообщение..." : "Задай свой вопрос..."}
                value={inputValue}
                onChange={handleInputChange}
                disabled={loading}
                onKeyDown={e => { if (e.key === 'Enter' && !dialogStarted) handleSend(); }}
              />
              <button className="p-2 flex items-center justify-center" type="button" onClick={handleSend} disabled={!inputValue.trim() || loading}>
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F4F6"/><path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <BottomMenu activeIndex={0} />
      </div>
    </div>
  );
} 