import BottomMenu from '../components/BottomMenu';
import UserProfileHeader from '../components/UserProfileHeader';
import { useUser } from '../context/UserContext';

export default function Today() {
  const { userData } = useUser();
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white pt-0 mx-auto">
      <UserProfileHeader name={userData.name || 'Имя'} username={userData.username || '@username'} />
      <h1 className="text-center text-2xl font-semibold mb-8 mt-8">На сегодня</h1>
      <BottomMenu activeIndex={3} />
    </div>
  );
} 