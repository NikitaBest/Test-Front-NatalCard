import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Settings() {
  const { userData } = useUser();
  const [showChatList, setShowChatList] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);

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
        {/* Фиксированная шапка */}
        <div className="w-full max-w-md mx-auto sticky top-0 z-20 bg-white/90">
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
            <h2 className="flex-1 text-center text-2xl font-bold text-gray-900">История чатов</h2>
            <div className="w-9" />
          </div>
        </div>
        {/* Список чатов */}
        <div className="w-full max-w-md mx-auto bg-white/80 shadow-sm border border-gray-200 overflow-hidden pb-[56px]">
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
                <div className="max-h-[60vh] overflow-y-auto px-2 py-4 bg-[#fafbfc]">
                  {loadingHistory ? (
                    <div className="text-center py-8">Загрузка истории...</div>
                  ) : (
                    messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">Нет сообщений в чате</div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
                          <div className={`rounded-xl px-4 py-3 max-w-[80%] text-base font-sans ${msg.isUser ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
                {/* Поле ввода для продолжения чата */}
                <div className="w-full px-2 pb-4">
                  <ChatInputSection chatId={selectedChat.id} onMessageSent={msg => setMessages(prev => [...prev, msg])} disabled={loadingHistory} />
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
    <div className="min-h-screen bg-white pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
      />
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
      <BottomMenu activeIndex={1} />
    </div>
  );
}

// --- ChatInputSection ---
function ChatInputSection({ chatId, onMessageSent, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Добавляем сообщение пользователя в историю
      onMessageSent({
        isUser: true,
        content: inputValue.trim(),
        createdAt: data.value.createdAt,
      });
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
        onMessageSent({
          isUser: false,
          content: answerData.value.content,
          createdAt: answerData.value.createdAt,
        });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
} 