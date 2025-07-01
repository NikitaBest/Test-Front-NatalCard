import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';

export default function BirthTime() {
  const { setUserData } = useUser();
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!time) return;
    setUserData(prevData => ({ ...prevData, birthTime: time }));
    navigate('/birth-city');
  };

  return (
    <StepWrapper>
      <div>
        <h1 className="text-xl font-semibold text-center mb-8">Время вашего рождения</h1>
        <div className="mb-6">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!time} className="mx-auto">Продолжить</Button>
    </StepWrapper>
  );
}