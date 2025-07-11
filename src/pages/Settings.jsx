import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { userData } = useUser();
  const [showChatList, setShowChatList] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка чатов
  useEffect(() => {
    if (!showChatList) return;
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
  }, [showChatList]);

  // Загрузка истории чата
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
        <div className="w-full max-w-md mx-auto bg-white/80 shadow-sm border border-gray-200 mt-2 rounded-xl overflow-hidden">
          <div className="flex items-center px-4 py-4 border-b border-gray-300">
            {selectedChat ? (
              <button className="mr-2 text-2xl" onClick={() => setSelectedChat(null)}>&larr;</button>
            ) : (
              <button className="mr-2 text-2xl" onClick={() => setShowChatList(false)}>&larr;</button>
            )}
            <h2 className="text-2xl font-mono text-center flex-1">История чатов</h2>
          </div>
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          {!selectedChat && (
            <div>
              {loadingChats ? (
                <div className="text-center py-8">Загрузка чатов...</div>
              ) : (
                chats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Нет чатов</div>
                ) : (
                  chats.map((chat, idx) => (
                    <button
                      key={chat.id}
                      className="w-full flex justify-between items-center px-6 py-4 border-b border-gray-200 text-base font-mono text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setSelectedChat(chat)}
                    >
                      <span className="text-left font-normal">{chat.mainQuestion || `Вопрос ${idx + 1}`}</span>
                      <span className="text-right font-normal text-gray-400 text-sm">{formatDate(chat.lastMessageTime)}</span>
                    </button>
                  ))
                )
              )}
            </div>
          )}
          {selectedChat && (
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
          )}
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
          <span className="text-right font-normal w-1/2 break-words text-gray-400">{chats.length ? `${chats.length} чатов` : ''}</span>
        </button>
      </div>
      <BottomMenu activeIndex={1} />
    </div>
  );
} 