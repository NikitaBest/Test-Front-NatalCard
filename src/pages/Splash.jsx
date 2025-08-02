// src/pages/Splash.jsx
import planetGif from '../assets/planet.gif';
import { useLanguage } from '../context/LanguageContext';

export default function Splash({ fadeOut = false }) {
  const { t } = useLanguage();
  
  return (
    <div className={`relative min-h-screen bg-white overflow-hidden ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <img
        src={planetGif}
        alt="Анимация"
        className="absolute inset-0 w-screen h-screen object-contain"
        style={{ zIndex: 1, transform: 'scale(1.5)' }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1" />
        <div className="mb-16">
          <p className="w-full max-w-[320px] mx-auto text-center font-sans text-sm font-normal leading-none text-[#1A1A1A]/60">
            {t('splash.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
