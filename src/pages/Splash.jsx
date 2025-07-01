// src/pages/Splash.jsx
import planetGif from '../assets/planet.gif';

export default function Splash({ fadeOut = false }) {
  return (
    <div className={`flex flex-col justify-between min-h-[100dvh] items-center bg-white transition-opacity duration-500 overflow-x-hidden ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div />
      <img
        src={planetGif}
        alt="Анимация"
        className="w-full max-w-xs sm:max-w-md h-auto max-h-[60vh] object-contain"
      />
      <p className="w-auto max-w-md mx-auto mb-8 text-center font-sans text-xs sm:text-sm font-normal leading-none text-[#1A1A1A]/60">
        Точные расчеты на основе ведической астрологии и актуальных данных NASA
      </p>
    </div>
  );
}
