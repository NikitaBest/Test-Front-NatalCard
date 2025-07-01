import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';

export default function Name() {
  const { setUserData } = useUser();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!name.trim()) return;
    setUserData(prevData => ({ ...prevData, name }));
    navigate('/gender');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-semibold text-center mt-2">Как вас зовут?</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-6 w-full mt-8">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя..."
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!name.trim()} className="mx-auto">Продолжить</Button>
    </StepWrapper>
  );
}
