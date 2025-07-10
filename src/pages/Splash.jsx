// src/pages/Splash.jsx
import planetGif from '../assets/planet.gif';

export default function Splash({ fadeOut = false }) {
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
        <p className="w-auto max-w-md mx-auto mb-4 text-center font-sans text-xs sm:text-sm font-normal leading-none text-[#1A1A1A]/60">
          Точные расчеты на основе ведической астрологии<br />
          и актуальных данных NASA
        </p>
      </div>
    </div>
  );
}
