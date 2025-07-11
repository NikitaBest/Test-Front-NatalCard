import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import TodayCalendar from '../components/TodayCalendar';
import TodayInfoBlock from '../components/TodayInfoBlock';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

function getToday() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

// Массив изображений для объяснений (как в Profile.jsx)
const explanationImages = [
  '/img_11.png',
  '/image 313.png',
  '/img_12.png',
  '/imm11.png',
  '/imm06.png',
];

export default function Today() {
  const { userData } = useUser();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDaily() {
      setLoading(true);
      setError(null);
      try {
        // Формат даты для запроса: DD.MM.YYYY
        const dateStr = selectedDate.toLocaleDateString('ru-RU');
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Нет токена авторизации');
        const res = await fetch(
          `https://astro-backend.odonta.burtimaxbot.ru/user/daily-horoscope?date=${dateStr}`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        if (!data.value || !data.value.explanations || !data.value.explanations[0]) {
          throw new Error('Нет данных на выбранную дату');
        }
        const explanation = data.value.explanations[0];
        // Выбор изображения по дню месяца (или другой логике)
        const imageIdx = selectedDate.getDate() % explanationImages.length;
        setDailyData({
          title: explanation.title,
          tips: (explanation.subTitles || []).map((sub, i) => ({
            icon: i === 0 ? '⭐' : '🌱',
            text: sub
          })),
          image: explanationImages[imageIdx],
          blocks: [
            {
              title: explanation.title,
              text: explanation.description
            }
          ]
        });
      } catch (e) {
        setError(e.message);
        setDailyData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDaily();
  }, [selectedDate]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white pt-10 mx-auto">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.username || '@username'} />
      <div className="border-t border-gray-300/60 w-full mt-8 mb-0" />
      <TodayCalendar value={selectedDate} onChange={setSelectedDate} />
      <div className="border-t border-gray-300/60 w-full my-0" />
      <h2 className="text-center font-mono text-2xl font-normal text-gray-800 mt-10 mb-6">Ежедневный расклад</h2>
      {loading && <div className="text-center text-gray-400">Загрузка...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {dailyData && (
        <TodayInfoBlock
          title={dailyData.title}
          tips={dailyData.tips}
          image={dailyData.image ? <img src={dailyData.image} alt="symbol" className="w-24 h-24 object-contain rounded-full" /> : null}
          blocks={dailyData.blocks}
        />
      )}
      <BottomMenu activeIndex={3} />
    </div>
  );
} 