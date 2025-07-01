import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-screen px-6 py-10 bg-white text-center">
      {/* Этот div используется для выравнивания с justify-between */}
      <div />

      {/* Основной контент */}
      <div className="flex flex-col items-center gap-10 w-full max-w-[366px] mx-auto">
        <div>
          <h1 className="font-mono font-normal font-[400] text-2xl leading-none text-[#1A1A1A] text-center max-w-[366px] w-full mx-auto">
            Раскройте тайны своей<br />натальной карты
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-500">
            Ваш персональный гид по звёздам.
          </p>
        </div>
        <div className="w-full">
          <Button onClick={() => navigate('/name')} variant="wide">
            Начать
          </Button>
        </div>
      </div>

      {/* Текст в футере */}
      <p className="w-full max-w-[320px] mx-auto text-center font-sans text-xs font-normal leading-none text-[#1A1A1A]/60">
        Точные расчеты на основе ведической астрологии и актуальных данных NASA
      </p>
    </div>
  );
}
