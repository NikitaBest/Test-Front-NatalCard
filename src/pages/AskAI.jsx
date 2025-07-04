import BottomMenu from '../components/BottomMenu';

export default function AskAI() {
  return (
    <div className="min-h-screen bg-white pt-10">
      <h1 className="text-center text-2xl font-semibold mb-8">Вопрос AI</h1>
      <BottomMenu activeIndex={0} />
    </div>
  );
} 