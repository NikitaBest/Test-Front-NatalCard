import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWrapper from '../components/StepWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

export default function Name() {
  const { setUserData } = useUser();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!name.trim()) return;
    setUserData(prevData => ({ ...prevData, name }));
    navigate('/gender');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">{t('name.title')}</h1>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-6 w-full mt-8">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('name.placeholder')}
          />
        </div>
      </div>
      <Button onClick={handleContinue} disabled={!name.trim()} className="mx-auto">{t('common.continue')}</Button>
    </StepWrapper>
  );
}
