import BottomMenu from '../components/BottomMenu';

export default function Settings() {
  return (
    <div className="min-h-screen bg-white pt-10">
      <h1 className="text-center text-2xl font-semibold mb-8">Настройки</h1>
      <BottomMenu activeIndex={1} />
    </div>
  );
} 