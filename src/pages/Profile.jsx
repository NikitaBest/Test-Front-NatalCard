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

export default function Profile() {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('map');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserChart()
      .then(data => setChartData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Массив изображений для объяснений
  const explanationImages = [
    '/img_11.png',
    '/image 313.png',
    '/img_12.png',
    '/imm11.png',
    '/imm06.png',
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white pt-10">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.username || '@username'} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === 'map' && (
        loading ? <div className="text-center my-8">Загрузка карты...</div> :
        error ? <div className="text-center my-8 text-red-500">{error}</div> :
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
      {activeTab === 'table' && (
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
      <BottomMenu activeIndex={2} />
    </div>
  );
} 