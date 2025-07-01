import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';

export default function Gender() {
  const { setUserData } = useUser();
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleSelect = (value) => {
    setGender(value);
  };

  const handleContinue = () => {
    if (!gender) return;
    setUserData(prev => ({ ...prev, gender }));
    navigate('/birth-date');
  };

  return (
    <StepWrapper>
      <h1 className="text-2xl font-normal text-center mt-2 font-mono">Укажите свой пол</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex justify-center w-full mt-12 gap-4">
          <button
            onClick={() => handleSelect('male')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              gender === 'male' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            Мужской
          </button>
          <button
            onClick={() => handleSelect('female')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              gender === 'female' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            Женский
          </button>
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!gender} className="mx-auto">Продолжить</Button>
    </StepWrapper>
  );
}
