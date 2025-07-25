import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import TodayCalendar from '../components/TodayCalendar';
import TodayInfoBlock from '../components/TodayInfoBlock';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { getUserChart } from '../utils/api';

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

function getSignNameByRasi(rasi) {
  const signs = [
    '', 'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];
  return signs[rasi] || '';
}

export default function Today() {
  const { userData } = useUser();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Загрузка натальной карты для знаков
  useEffect(() => {
    getUserChart().then(setChartData).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchDaily() {
      setLoading(true);
      setError(null);
      
      // Небольшая задержка перед очисткой данных для лучшего UX
      setTimeout(() => {
        setDailyData(null);
      }, 100);
      
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
        if (!data.value || !data.value.explanations || !data.value.explanations.length) {
          throw new Error('Нет данных на выбранную дату');
        }
        const explanations = data.value.explanations;
        setDailyData({
          blocks: explanations.map((explanation, idx) => ({
            title: explanation.title,
            tips: (explanation.sub_titles || []).map((sub, i) => ({
              icon: i === 0 ? '⭐' : '🌱',
              text: sub
            })),
            image: explanationImages[idx % explanationImages.length],
            text: explanation.description
          }))
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

  // Вычисляем знаки
  let ascSign = '', sunSign = '', moonSign = '';
  if (chartData && chartData.value && chartData.value.chart && Array.isArray(chartData.value.chart.planets)) {
    const planets = chartData.value.chart.planets;
    const asc = planets.find(p => p.planet === 1);
    const sun = planets.find(p => p.planet === 2);
    const moon = planets.find(p => p.planet === 3);
    ascSign = asc ? getSignNameByRasi(asc.rasi) : '';
    sunSign = sun ? getSignNameByRasi(sun.rasi) : '';
    moonSign = moon ? getSignNameByRasi(moon.rasi) : '';
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white mx-auto">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.userName || '@username'} photoUrl={userData.photoUrl || '/default-avatar.png'} ascSign={ascSign} sunSign={sunSign} moonSign={moonSign} />
      <div className="border-t border-gray-300/60 w-full mt-4 mb-0" />
      <TodayCalendar value={selectedDate} onChange={setSelectedDate} />
      <div className="border-t border-gray-300/60 w-full my-0" />
      <h2 className="text-center font-mono text-2xl font-normal text-gray-800 mb-6 mt-8">
        Расклад на {selectedDate.toLocaleDateString('ru-RU')}
      </h2>
      {loading && <div className="text-center text-gray-400">Загрузка...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {dailyData && (
        <TodayInfoBlock
          blocks={dailyData.blocks}
        />
      )}
      <BottomMenu activeIndex={3} />
    </div>
  );
} 