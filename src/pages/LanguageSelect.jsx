import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import StepWrapper from '../components/StepWrapper';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import Splash from './Splash';

export default function LanguageSelectPage() {
  const { language, changeLanguage, t } = useLanguage();
  const { isProfileFilled, isLoading } = useUser();
  const navigate = useNavigate();

  // Проверяем заполненность профиля при загрузке страницы
  useEffect(() => {
    if (isProfileFilled && !isLoading) {
      // Небольшая задержка чтобы убедиться, что состояние обновилось
      const timer = setTimeout(() => {
        navigate('/profile');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isProfileFilled, isLoading, navigate]);

  // Показываем сплэш пока загружается проверка пользователя
  if (isLoading) {
    return <Splash fadeOut={false} />;
  }

  const handleLanguageSelect = async (langValue) => {
    await changeLanguage(langValue);
  };

  const handleContinue = () => {
    navigate('/start');
  };

  return (
    <StepWrapper>
      <h1 className="text-xl font-normal text-center mt-2 font-mono">
        {t('languageSelect.title')}
      </h1>
      
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex justify-center w-full mt-12 gap-4">
          <button
            onClick={() => handleLanguageSelect('ru')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              language === 'ru' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            {t('languageSelect.russian')}
          </button>
          <button
            onClick={() => handleLanguageSelect('en')}
            className={`px-6 py-2 border-b-2 text-lg transition ${
              language === 'en' ? 'border-black font-semibold' : 'border-gray-300 text-gray-400'
            }`}
          >
            {t('languageSelect.english')}
          </button>
        </div>
      </div>
      
      <Button onClick={handleContinue} className="mx-auto">
        {t('common.continue')}
      </Button>
    </StepWrapper>
  );
} 