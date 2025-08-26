import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import TodayCalendar from '../components/TodayCalendar';
import TodayInfoBlock from '../components/TodayInfoBlock';
import HoroscopeLoadingAnimation from '../components/HoroscopeLoadingAnimation';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { getUserChart, getDailyHoroscope, checkDailyHoroscopeReady } from '../utils/api';

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
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [isCheckingReadiness, setIsCheckingReadiness] = useState(false);

  // Минимальное время показа анимации (4 секунды)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  // Функция для получения названия знака по номеру rasi
  function getSignNameByRasi(rasi) {
    const signs = [
      '', t('profile.signs.aries'), t('profile.signs.taurus'), t('profile.signs.gemini'), 
      t('profile.signs.cancer'), t('profile.signs.leo'), t('profile.signs.virgo'), 
      t('profile.signs.libra'), t('profile.signs.scorpio'), t('profile.signs.sagittarius'), 
      t('profile.signs.capricorn'), t('profile.signs.aquarius'), t('profile.signs.pisces')
    ];
    return signs[rasi] || '';
  }

  // Загрузка натальной карты для знаков
  useEffect(() => {
    getUserChart().then(setChartData).catch(() => {});
  }, []);

  // Функция для проверки готовности гороскопа
  const checkHoroscopeReadiness = async (dateStr) => {
    try {
      const isReady = await checkDailyHoroscopeReady(dateStr);
      return isReady;
    } catch (err) {
      console.error('Ошибка проверки готовности гороскопа:', err);
      return false;
    }
  };

  // Функция для загрузки данных гороскопа
  const fetchDailyHoroscope = async (dateStr) => {
    console.log('Starting fetchDailyHoroscope for date:', dateStr);
    setError(null);
    
    try {
      const data = await getDailyHoroscope(dateStr);
      console.log('Received horoscope data:', data);
      
      if (!data.value || !data.value.explanations || !data.value.explanations.length) {
        throw new Error(t('today.noData'));
      }
      
      const explanations = data.value.explanations;
      setDailyData({
        blocks: explanations.map((explanation, idx) => ({
          title: explanation.title,
          tips: (explanation.sub_titles || []).map((sub, i) => {
            let icon, prefix;
            switch(i) {
              case 0:
                icon = '🪙 ';
                prefix = t('today.headers.inResource') + ': ';
                break;
              case 1:
                icon = '👁️‍🗨️ ';
                prefix = t('today.headers.focusDay') + ': ';
                break;
              case 2:
                icon = '❗';
                prefix = t('today.headers.payAttention') + ': ';
                break;
              case 3:
                icon = '🧿';
                prefix = t('today.headers.affirmation') + ': ';
                break;
              default:
                icon = '○';
                prefix = '';
            }
            return {
              icon: icon,
              text: prefix + sub
            };
          }),
          image: explanationImages[idx % explanationImages.length],
          text: explanation.description
        }))
      });
      console.log('Daily data set successfully');
    } catch (e) {
      console.error('Error in fetchDailyHoroscope:', e);
      setError(e.message);
      setDailyData(null);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  // Основная логика проверки готовности и загрузки данных
  const startHoroscopeLoading = async (date) => {
    setIsCheckingReadiness(true);
    setLoading(true);
    setError(null);
    setShowLoadingAnimation(true);
    setMinTimePassed(false);
    
    // Небольшая задержка перед очисткой данных для лучшего UX
    setTimeout(() => {
      setDailyData(null);
    }, 100);
    
    // Формат даты для запроса: YYYY-MM-DD (DateOnly формат)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Проверяем готовность каждые 4 секунды
    const checkInterval = setInterval(async () => {
      try {
        const isReady = await checkHoroscopeReadiness(dateStr);
        
        if (isReady) {
          console.log('Horoscope is ready, stopping checks and loading data');
          clearInterval(checkInterval);
          setIsCheckingReadiness(false);
          // Гороскоп готов, загружаем данные
          await fetchDailyHoroscope(dateStr);
        }
      } catch (err) {
        console.error('Ошибка при проверке готовности гороскопа:', err);
        // Продолжаем проверять, не прерываем процесс
      }
    }, 4000);

    // Останавливаем проверку через 5 минут (максимальное время ожидания)
    setTimeout(() => {
      clearInterval(checkInterval);
      if (isCheckingReadiness) {
        setIsCheckingReadiness(false);
        setError('Превышено время ожидания готовности гороскопа');
        setLoading(false);
      }
    }, 300000); // 5 минут
  };

  useEffect(() => {
    startHoroscopeLoading(selectedDate);
  }, [selectedDate, t]);

  // Скрываем анимацию только когда данные загружены И прошло минимум 4 секунды
  useEffect(() => {
    console.log('Animation state check:', {
      minTimePassed,
      loading,
      isCheckingReadiness,
      showLoadingAnimation,
      hasData: !!dailyData
    });
    
    if (minTimePassed && !loading && !isCheckingReadiness) {
      console.log('Hiding loading animation');
      setShowLoadingAnimation(false);
    }
  }, [minTimePassed, loading, isCheckingReadiness, dailyData]);

  // Принудительно скрываем анимацию при наличии данных
  useEffect(() => {
    if (dailyData && showLoadingAnimation) {
      console.log('Forcing animation hide - data is available');
      setShowLoadingAnimation(false);
    }
  }, [dailyData, showLoadingAnimation]);

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
      <h2 className="text-center font-mono text-1xl font-normal text-gray-800 mb-6 mt-8">
        {t('today.title').replace('{date}', selectedDate.toLocaleDateString('ru-RU'))}
      </h2>
      {(loading || showLoadingAnimation || isCheckingReadiness) && !dailyData && <HoroscopeLoadingAnimation />}
      {error && <div className="text-center text-red-500">{error}</div>}
      {dailyData && (
        <TodayInfoBlock
          blocks={dailyData.blocks}
        />
      )}
      <BottomMenu 
        activeIndex={3} 
        isNavigationDisabled={loading || showLoadingAnimation || isCheckingReadiness} 
      />
    </div>
  );
} 