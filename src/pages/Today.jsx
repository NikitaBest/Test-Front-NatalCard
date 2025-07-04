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

export default function Today() {
  const { userData } = useUser();
  const [selectedDate, setSelectedDate] = useState(getToday);

  useEffect(() => {
    // Если пользователь зашёл на страницу в другой день, обновить selectedDate
    const today = getToday();
    if (selectedDate.toDateString() !== today.toDateString()) {
      setSelectedDate(today);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white pt-0 mx-auto">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.username || '@username'} />
      <TodayCalendar value={selectedDate} onChange={setSelectedDate} />
      <h2 className="text-center font-mono text-2xl font-normal text-gray-800 mt-10 mb-6">Ежедневный расклад</h2>
      <TodayInfoBlock
        title="Солнце в Стрельце"
        tips={[
          { icon: '⭐', text: 'Сегодня вас ждет лучший день в вашей жизни' },
          { icon: '🌱', text: 'Будьте осторожнее в первой половине дня' },
        ]}
        image={<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Black_and_white_eye.jpg" alt="eye" className="w-24 h-24 object-contain rounded-full" />}
        blocks={[
          {
            title: 'Ваше Солнце',
            text: 'определяет ваше эго, идентичность и главную роль в жизни. Находясь в знаке Стрельца, оно наделяет вас неутомимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.'
          },
          {
            title: 'Ваша Луна',
            text: 'определяет ваше эго, идентичность и главную роль в жизни. Находясь в знаке Стрельца, оно наделяет вас неутомимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.'
          }
        ]}
      />
      <BottomMenu activeIndex={3} />
    </div>
  );
} 