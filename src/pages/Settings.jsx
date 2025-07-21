import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

export default function Settings() {
  const { userData, setUserData } = useUser();
  const [showChatList, setShowChatList] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Загружаем чаты сразу при заходе на страницу (для отображения количества)
  useEffect(() => {
    async function fetchChats() {
      setLoadingChats(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://astro-backend.odonta.burtimaxbot.ru/ai-chat/chats', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Ошибка загрузки чатов');
        const data = await res.json();
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
        const token = localStorage.getItem('token');
        const res = await fetch(`https://astro-backend.odonta.burtimaxbot.ru/ai-chat/history?chatId=${selectedChat.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Ошибка загрузки истории чата');
        const data = await res.json();
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
          src="/bg2.png"
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
          style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
        />
        {/* Фиксированная шапка только если не выбран чат */}
        {!selectedChat && (
          <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full max-w-md mx-auto mt-4">
            <div className="flex items-center px-4 py-4 border-b border-gray-300">
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
              <h2 className="flex-1 text-center text-2xl font-normal text-gray-900">История чатов</h2>
              <div className="w-9" />
            </div>
          </div>
        )}
        {/* Список чатов */}
        <div className="w-full max-w-md mx-auto bg-white/80 shadow-sm border border-gray-200 overflow-hidden pb-[56px] pt-[88px]">
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
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
                          className="w-full flex justify-between items-center px-6 py-4 text-base font-mono text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setSelectedChat(chat)}
                        >
                          <span
                            className="text-left font-normal overflow-hidden text-ellipsis whitespace-normal"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {chat.mainQuestion || `Вопрос ${idx + 1}`}
                          </span>
                          <span className="text-right font-normal text-gray-400 text-sm">{formatDate(chat.lastMessageTime)}</span>
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
                <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 w-full max-w-md mx-auto mt-4">
                  <div className="flex items-center px-4 py-4 border-b border-gray-300">
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
                    <h2 className="flex-1 text-center text-2xl font-normal text-gray-900">История чатов</h2>
                    <div className="w-9" />
                  </div>
                </div>
                {/* Контейнер сообщений */}
                <ChatMessagesList messages={messages} loading={loadingHistory} />
                {/* Фиксированное поле ввода */}
                <div className="fixed left-0 right-0 bottom-[45px] z-50 w-full flex justify-center pointer-events-none">
                  <div className="w-full max-w-md mx-auto px-2 pointer-events-auto">
                    <ChatInputSection chatId={selectedChat.id} onMessageSent={msg => setMessages(prev => [...prev, msg])} disabled={loadingHistory} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <BottomMenu activeIndex={1} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-grow overflow-y-auto pt-10 pb-24 relative">
        <img
          src="/bg2.png"
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
          style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
        />
        <div className="relative z-10">
          <h1 className="text-xl font-normal text-center mt-2 font-mono">Настройки</h1>
          <hr className="w-[90%] mx-auto border-gray-300 my-4" />
          <h2 className="text-center text-lg font-normal text-gray-700 mb-8 font-mono">Профиль пользователя</h2>
          <div className="w-full max-w-xl mx-auto bg-[#fafbfc] shadow-sm mb-8 border border-gray-200">
            {[
              { label: 'Имя', value: userData.name || '' },
              { label: 'Ник', value: userData.userName ? `@${userData.userName}` : '@username' },
              { label: 'Пол', value: (userData.gender === 1 || userData.gender === 'male') ? 'Мужской' : (userData.gender === 2 || userData.gender === 'female') ? 'Женский' : '' },
              { label: 'Дата рождения', value: userData.birthDate || '' },
              { label: 'Время рождения', value: userData.birthTime || '' },
              { label: 'Место рождения', value: userData.birthLocation || userData.birthCity || userData.birth_city || '' },
            ].map((row, idx) => (
              <div key={row.label} className="flex justify-between items-center px-6 py-4 border-b border-gray-300 text-base font-mono text-gray-700 last:border-b-0">
                <span className="text-left font-normal w-1/2">{row.label}</span>
                <span className="text-right font-normal w-1/2 break-words">{row.value}</span>
              </div>
            ))}
            {/* История чата — отдельная строка */}
            <button
              className="flex justify-between items-center w-full px-6 py-4 border-b border-gray-300 text-base font-mono text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setShowChatList(true)}
            >
              <span className="text-left font-normal w-1/2">История чата</span>
              <span className="text-right font-normal w-1/2 break-words text-gray-400">{loadingChats ? '...' : chats.length ? `${chats.length} чатов` : ''}</span>
            </button>
          </div>
          {/* Кнопка изменить данные */}
          <div className="px-4">
            <button
              className="w-full max-w-xs mx-auto mt-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-base font-mono flex items-center justify-center"
              onClick={() => setShowModal(true)}
            >
              Изменить данные
            </button>
          </div>
        </div>
      </div>
      {/* Модалка подтверждения */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90vw] max-w-xs flex flex-col items-center">
            <div className="text-lg font-normal text-center mb-6">Вы уверены, что хотите изменить данные?</div>
            <div className="flex gap-8">
              <button
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl hover:bg-gray-300"
                onClick={() => setShowModal(false)}
                aria-label="Отмена"
              >✕</button>
              <button
                className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-2xl hover:bg-green-300"
                onClick={() => {
                  localStorage.removeItem('user');
                  setUserData({ name: '', gender: '', birthDate: '', birthTime: '', birthLocation: '' });
                  setShowModal(false);
                  navigate('/name');
                }}
                aria-label="Подтвердить"
              >✔</button>
            </div>
          </div>
        </div>
      )}
      <BottomMenu activeIndex={1} />
    </div>
  );
}

// --- ChatInputSection ---
function ChatInputSection({ chatId, onMessageSent, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessages, setNewMessages] = useState([]); // Отслеживаем новые сообщения

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const now = new Date();
    const dateTime = now.toISOString();
    try {
      // Отправляем сообщение пользователя
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
      
      // Добавляем сообщение пользователя в историю (отображается сразу)
      const userMessage = {
        isUser: true,
        content: inputValue.trim(),
        createdAt: data.value.createdAt,
      };
      onMessageSent(userMessage);
      setInputValue("");
      
      // Получаем ответ ИИ
      const answerRes = await fetch(`https://astro-backend.odonta.burtimaxbot.ru/ai-chat/answer?dateTime=${encodeURIComponent(data.value.createdAt)}&chatId=${chatId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!answerRes.ok) throw new Error('Ошибка получения ответа ИИ');
      const answerData = await answerRes.json();
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
    }
  };

  return (
    <>
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
      <div className="flex items-center border-t border-gray-300 bg-white rounded-b-xl">
        <input
          className="flex-1 py-5 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
          placeholder="Введите сообщение..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={loading || disabled}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button className="p-2 flex items-center justify-center" type="button" onClick={handleSend} disabled={!inputValue.trim() || loading || disabled}>
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F4F6"/><path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
      </div>
    </>
  );
} 

// --- ChatMessagesList ---
function ChatMessagesList({ messages, loading }) {
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
      className="w-full bg-white/80 rounded-xl shadow-none mb-8 px-4 py-6 flex flex-col gap-6 overflow-y-auto"
      style={{
        maxHeight: 'calc(100vh - 220px)', // 220px: примерная высота хедера + инпута
        minHeight: '200px',
        marginTop: '88px', // отступ под фиксированный хедер
      }}
    >
      {loading ? (
        <div className="text-center py-8">Загрузка истории...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Нет сообщений в чате</div>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            {msg.isUser ? (
              <div className="rounded-xl px-4 py-3 max-w-[80%] text-base font-sans bg-black text-white">
                {msg.content}
              </div>
            ) : (
              msg.isNew ? (
                <TypewriterEffect text={msg.content} />
              ) : (
                <div className="rounded-xl px-4 py-3 max-w-[80%] text-base font-sans bg-gray-100 text-gray-900">
                  {msg.content}
                </div>
              )
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 