import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../utils/api';

export default function BirthCity() {
  const { userData, setUserData } = useUser();
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!city.trim()) return;
    setUserData(prevData => ({ ...prevData, birthCity: city }));
    setLoading(true);
    try {
      // Формируем объект для updateUserProfile
      const profileData = {
        name: userData.name,
        gender: userData.gender === 'male' ? 1 : 0,
        birthDate: userData.birthDate,
        birthTime: userData.birthTime,
        birthLocation: city,
        latitude: 0, // TODO: вычислить по городу
        longitude: 0, // TODO: вычислить по городу
        utc: 0 // TODO: вычислить по городу
      };
      await updateUserProfile(profileData);
      navigate('/profile');
    } catch (err) {
      alert('Ошибка при сохранении профиля: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">Город вашего рождения</h1>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-full max-w-[350px] mt-8 mb-6 flex justify-center">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Например, Москва"
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!city.trim() || loading} className="mx-auto w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis text-lg sm:text-xl text-center">{loading ? 'Сохраняем...' : 'Рассчитать натальную карту'}</Button>
    </StepWrapper>
  );
} 