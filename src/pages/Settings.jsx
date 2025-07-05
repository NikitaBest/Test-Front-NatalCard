import BottomMenu from '../components/BottomMenu';

export default function Settings() {
  return (
    <div className="min-h-screen bg-white pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 1, filter: 'drop-shadow(0 0 10px #000) brightness(0.5) contrast(2.5)' }}
      />
      <h1 className="text-center text-2xl font-semibold mb-8 relative z-10">Настройки</h1>
      <BottomMenu activeIndex={1} />
    </div>
  );
} 