import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useEffect } from 'react';
import { fetchUserProfile } from '../utils/api';
import { useUser } from '../context/UserContext';

function isProfileFilled(user) {
  return (
    user &&
    typeof user.name === 'string' && user.name.trim() &&
    typeof user.birthDate === 'string' && user.birthDate.trim() &&
    typeof user.birthTime === 'string' && user.birthTime.trim() &&
    typeof user.birthLocation === 'string' && user.birthLocation.trim()
  );
}

export default function Start() {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  useEffect(() => {
    async function checkProfile() {
      const token = localStorage.getItem('token');
      if (!token) return; // если нет токена — пусть идёт по шагам

      try {
        const data = await fetchUserProfile();
        if (data && data.value) {
          setUserData(data.value);
          localStorage.setItem('user', JSON.stringify(data.value));
          // Проверяем заполненность профиля
          if (isProfileFilled(data.value)) {
            navigate('/profile');
          }
        }
      } catch (e) {
        // Ошибка — пусть идёт по шагам
      }
    }
    checkProfile();
  }, [navigate, setUserData]);

  return (
    <div className="flex flex-col justify-between h-screen px-6 py-10 bg-white text-center">
      {/* Этот div используется для выравнивания с justify-between */}
      <div />

      {/* Основной контент */}
      <div className="flex flex-col items-center gap-10 w-full max-w-[366px] mx-auto">
        <div>
          <h1 className="text-xl font-normal text-center mt-2 font-mono max-w-[366px] w-full mx-auto">
            Раскройте тайны своей<br />натальной карты
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-500/70 text-[#1A1A1A]/50">
            Ваш персональный гид по звёздам.
          </p>
        </div>
        <div className="w-full">
          <Button onClick={() => navigate('/name')} variant="wide" className="text-2xl">
            Начать
          </Button>
        </div>
      </div>

      {/* Текст в футере */}
      <p className="w-full max-w-[320px] mx-auto text-center font-sans text-xs font-normal leading-none text-[#1A1A1A]/60">
        Точные расчеты на основе ведической астрологии<br />
         и актуальных данных NASA
      </p>
    </div>
  );
}
