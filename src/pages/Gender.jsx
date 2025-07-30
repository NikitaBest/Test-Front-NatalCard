import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelect from '../components/LanguageSelect';

export default function Gender() {
  const { setUserData } = useUser();
  const { t } = useLanguage();
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
      {/* Переключатель языка в правом верхнем углу */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelect variant="compact" />
      </div>
      
      <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('gender.title')}</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex justify-center w-full mt-12 gap-4">
          <button
            onClick={() => handleSelect('male')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              gender === 'male' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            {t('gender.male')}
          </button>
          <button
            onClick={() => handleSelect('female')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              gender === 'female' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            {t('gender.female')}
          </button>
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!gender} className="mx-auto">{t('common.continue')}</Button>
    </StepWrapper>
  );
}
