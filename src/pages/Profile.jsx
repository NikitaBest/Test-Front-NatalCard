import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import NatalChartSquare from '../components/NatalChartSquare';
import NatalTable from '../components/NatalTable';
import { useUser } from '../context/UserContext';
import { useState } from 'react';

export default function Profile() {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('map');
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white pt-0">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.username || '@username'} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === 'map' && <NatalChartSquare />}
      {activeTab === 'table' && <NatalTable />}
      <BottomMenu activeIndex={2} />
    </div>
  );
} 