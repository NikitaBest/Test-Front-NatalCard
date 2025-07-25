import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import NatalChartSquare from '../components/NatalChartSquare';
import NatalTable from '../components/NatalTable';
import ProfileInfoBlock from '../components/ProfileInfoBlock';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { getUserChart } from '../utils/api';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Profile() {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('map');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // Начинаем с true
  const [error, setError] = useState(null);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false); // Предотвращаем множественные запросы

  const fetchChartData = () => {
    if (isRequestInProgress) return; // Не делаем запрос, если уже идет
    
    setLoading(true);
    setError(null);
    setChartData(null); // Очищаем старые данные при каждом новом запросе
    setIsRequestInProgress(true);
    
    // Создаем таймаут для запроса - увеличиваем до 60 секунд
    const timeoutId = setTimeout(() => {
      setError('Построение карты занимает больше времени. Попробуйте позже или перейдите на другую страницу и вернитесь.');
      setLoading(false);
      setIsRequestInProgress(false);
    }, 60000); // 60 секунд таймаут
    
    getUserChart()
      .then(data => {
        clearTimeout(timeoutId);
        setChartData(data);
        setError(null);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        setError(err.message);
        setChartData(null);
      })
      .finally(() => {
        setLoading(false);
        setIsRequestInProgress(false);
      });
      
    // Очистка таймаута при размонтировании
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // Массив изображений для объяснений
  const explanationImages = [
    '/img_11.png',
    '/image 313.png',
    '/img_12.png',
    '/imm11.png',
    '/imm06.png',
  ];

  // Функция для получения названия знака по номеру rasi
  function getSignNameByRasi(rasi) {
    const signs = [
      '', 'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
    ];
    return signs[rasi] || '';
  }

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
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.userName || '@username'} photoUrl={userData.photoUrl || '/default-avatar.png'} ascSign={ascSign} sunSign={sunSign} moonSign={moonSign} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              <div className="text-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
                <p className="mt-4">Загрузка карты...</p>
              </div>
            ) : error ? (
              <div className="text-center my-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={fetchChartData}
                  disabled={isRequestInProgress}
                >
                  {isRequestInProgress ? 'Загрузка...' : 'Попробовать снова'}
                </button>
              </div>
            ) : (
              <>
                <NatalChartSquare chartData={chartData} />
                {/* Динамические объяснения под картой */}
                {chartData && chartData.value && chartData.value.chart && Array.isArray(chartData.value.chart.explanations) && chartData.value.chart.explanations.length > 0 && (
                  chartData.value.chart.explanations.map((ex, idx) => (
                    <React.Fragment key={ex.id || idx}>
                      <ProfileInfoBlock title={ex.title} text={ex.description}>
                        <img src={explanationImages[idx % explanationImages.length]} alt="symbol" className="w-24 h-24 object-contain rounded-full" />
                      </ProfileInfoBlock>
                    </React.Fragment>
                  ))
                )}
              </>
            )}
          </motion.div>
        )}
        {activeTab === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              <div className="text-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
                <p className="mt-4">Загрузка данных...</p>
              </div>
            ) : error ? (
              <div className="text-center my-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={fetchChartData}
                  disabled={isRequestInProgress}
                >
                  {isRequestInProgress ? 'Загрузка...' : 'Попробовать снова'}
                </button>
              </div>
            ) : (
              <>
                <NatalTable chartData={chartData} />
                {/* Динамические объяснения под таблицей */}
                {chartData && chartData.value && chartData.value.chart && Array.isArray(chartData.value.chart.explanations) && chartData.value.chart.explanations.length > 0 && (
                  chartData.value.chart.explanations.map((ex, idx) => (
                    <React.Fragment key={ex.id || idx}>
                      <ProfileInfoBlock title={ex.title} text={ex.description}>
                        <img src={explanationImages[idx % explanationImages.length]} alt="symbol" className="w-24 h-24 object-contain rounded-full" />
                      </ProfileInfoBlock>
                    </React.Fragment>
                  ))
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <BottomMenu activeIndex={2} />
    </div>
  );
} 