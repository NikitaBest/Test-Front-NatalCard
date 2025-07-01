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
    navigate('/success');
  };

  return (
    <StepWrapper>
      <div>
        <h1 className="text-xl font-semibold text-center mb-8">Город вашего рождения</h1>
        <div className="mb-6">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Например, Москва"
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!city.trim()}>Завершить</Button>
    </StepWrapper>
  );
} 