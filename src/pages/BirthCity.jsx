import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';

export default function BirthCity() {
  const { setUserData } = useUser();
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!city.trim()) return;
    setUserData(prevData => ({ ...prevData, birthCity: city }));
    navigate('/profile');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-semibold text-center mb-8">Город вашего рождения</h1>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-full max-w-[350px] mt-8 mb-6 flex justify-center">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Например, Москва"
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!city.trim()} className="mx-auto">Завершить</Button>
    </StepWrapper>
  );
} 