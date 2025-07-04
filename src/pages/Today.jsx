import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import TodayCalendar from '../components/TodayCalendar';
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
      <BottomMenu activeIndex={3} />
    </div>
  );
} 