import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';

export default function BirthDate() {
  const { setUserData } = useUser();
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!date) return;
    setUserData(prevData => ({ ...prevData, birthDate: date }));
    navigate('/birth-time');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-semibold text-center mt-2">Укажите свою дату рождения</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-6 w-full mt-8">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!date} className="mx-auto">Продолжить</Button>
    </StepWrapper>
  );
} 