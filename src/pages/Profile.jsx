import React, { useState, useEffect } from 'react';
import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import NatalChartSquare from '../components/NatalChartSquare';
import NatalTable from '../components/NatalTable';
import ChartLoadingAnimation from '../components/ChartLoadingAnimation';
import ProfileInfoBlock from '../components/ProfileInfoBlock';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserChart, checkUserChartReady } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { userData } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('map');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
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

  // Функция для проверки готовности карты
  const checkChartReadiness = async () => {
    try {
      const isReady = await checkUserChartReady();
      return isReady;
    } catch (err) {
      console.error('Ошибка проверки готовности карты:', err);
      return false;
    }
  };

  // Функция для загрузки данных карты
  const fetchChartData = async () => {
    setIsRequestInProgress(true);
    setError(null);
    
    try {
      const data = await getUserChart();
      setChartData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRequestInProgress(false);
      setLoading(false);
    }
  };

  // Основная логика проверки готовности и загрузки данных
  const startChartLoading = async () => {
    setIsCheckingReadiness(true);
    setLoading(true);
    setError(null);
    setShowLoadingAnimation(true);
    setMinTimePassed(false);
    
    // Проверяем готовность каждые 4 секунды
    const checkInterval = setInterval(async () => {
      try {
        const isReady = await checkChartReadiness();
        
        if (isReady) {
          clearInterval(checkInterval);
          setIsCheckingReadiness(false);
          // Карта готова, загружаем данные
          await fetchChartData();
        }
      } catch (err) {
        console.error('Ошибка при проверке готовности:', err);
        // Продолжаем проверять, не прерываем процесс
      }
    }, 4000);

    // Останавливаем проверку через 5 минут (максимальное время ожидания)
    setTimeout(() => {
      clearInterval(checkInterval);
      if (isCheckingReadiness) {
        setIsCheckingReadiness(false);
        setError('Превышено время ожидания готовности карты');
        setLoading(false);
      }
    }, 300000); // 5 минут
  };

  // Скрываем анимацию только когда данные загружены И прошло минимум 4 секунды
  useEffect(() => {
    if (minTimePassed && !loading && !isRequestInProgress && !isCheckingReadiness) {
      setShowLoadingAnimation(false);
    }
  }, [minTimePassed, loading, isRequestInProgress, isCheckingReadiness]);

  useEffect(() => {
    startChartLoading();
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
    <div className="min-h-screen w-full overflow-x-hidden bg-white profile-scroll-fix">
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
            {(loading || showLoadingAnimation || isCheckingReadiness) ? (
              <ChartLoadingAnimation />
            ) : error ? (
              <div className="text-center my-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={startChartLoading}
                  disabled={isRequestInProgress || isCheckingReadiness}
                >
                  {isRequestInProgress || isCheckingReadiness ? t('common.loading') : t('profile.error.retry')}
                </button>
              </div>
            ) : (
              <>
                <NatalChartSquare chartData={chartData} />
                {/* Динамические объяснения под картой */}
                {chartData && chartData.value && chartData.value.chart && Array.isArray(chartData.value.chart.explanations) && chartData.value.chart.explanations.length > 0 && (
                  chartData.value.chart.explanations.map((ex, idx) => (
                    <React.Fragment key={ex.id || idx}>
                      <ProfileInfoBlock title={ex.title} text={ex.description} index={idx}>
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
            {(loading || showLoadingAnimation || isCheckingReadiness) ? (
              <ChartLoadingAnimation />
            ) : error ? (
              <div className="text-center my-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={startChartLoading}
                  disabled={isRequestInProgress || isCheckingReadiness}
                >
                  {isRequestInProgress || isCheckingReadiness ? t('common.loading') : t('profile.error.retry')}
                </button>
              </div>
            ) : (
              <>
                <NatalTable chartData={chartData} />
                {/* Динамические объяснения под таблицей */}
                {chartData && chartData.value && chartData.value.chart && Array.isArray(chartData.value.chart.explanations) && chartData.value.chart.explanations.length > 0 && (
                  chartData.value.chart.explanations.map((ex, idx) => (
                    <React.Fragment key={ex.id || idx}>
                      <ProfileInfoBlock title={ex.title} text={ex.description} index={idx}>
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