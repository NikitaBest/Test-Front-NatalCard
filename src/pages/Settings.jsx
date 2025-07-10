import BottomMenu from '../components/BottomMenu';
import { useUser } from '../context/UserContext';

export default function Settings() {
  const { userData } = useUser();

  return (
    <div className="min-h-screen bg-white pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 0.3, filter: 'drop-shadow(0 0 10px #000) brightness(0.3) contrast(1)' }}
      />
      <h1 className="text-xl font-normal text-center mt-2 font-mono">Настройки</h1>
      <hr className="w-[90%] mx-auto border-gray-300 my-4" />
      <h2 className="text-center text-lg font-normal text-gray-700 mb-8 font-mono">Профиль пользователя</h2>
      <div className="w-full max-w-xl mx-auto bg-[#fafbfc] shadow-sm mb-8 border border-gray-200">
        {[
          { label: 'Имя', value: userData.name || '' },
          { label: 'Ник', value: userData.userName ? `@${userData.userName}` : '@username' },
          { label: 'Пол', value: (userData.gender === 1 || userData.gender === 'male') ? 'Мужской' : (userData.gender === 2 || userData.gender === 'female') ? 'Женский' : '' },
          { label: 'Дата рождения', value: userData.birthDate || '' },
          { label: 'Время рождения', value: userData.birthTime || '' },
          { label: 'Место рождения', value: userData.birthLocation || userData.birthCity || userData.birth_city || '' },
          { label: 'История чата', value: '16 чатов' },
        ].map((row, idx) => (
          <div key={row.label} className="flex justify-between items-center px-6 py-4 border-b border-gray-300 text-base font-mono text-gray-700 last:border-b-0">
            <span className="text-left font-normal w-1/2">{row.label}</span>
            <span className="text-right font-normal w-1/2 break-words">{row.value}</span>
          </div>
        ))}
      </div>
      <BottomMenu activeIndex={1} />
    </div>
  );
} 