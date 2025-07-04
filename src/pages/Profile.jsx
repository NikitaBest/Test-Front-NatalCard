import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import NatalChartSquare from '../components/NatalChartSquare';
import NatalTable from '../components/NatalTable';
import ProfileInfoBlock from '../components/ProfileInfoBlock';
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
      <ProfileInfoBlock
        title="Солнце в Стрельце"
        text={<>
          <b>Ваше Солнце</b> определяет ваше эго, идентичность и главную роль в жизни. <br />
          Находясь в знаке Стрельца, оно наделяет вас неутомимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.
        </>}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Black_and_white_eye.jpg" alt="eye" className="w-24 h-24 object-contain rounded-full" />
      </ProfileInfoBlock>
      <BottomMenu activeIndex={2} />
    </div>
  );
} 