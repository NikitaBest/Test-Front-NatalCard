import BottomMenu from '../components/BottomMenu';
import AskAITabs from '../components/AskAITabs';
import { useState } from 'react';

function HamburgerIcon() {
  return (
    <div className="flex flex-col justify-center items-center h-10 w-10">
      <span className="block w-7 h-0.5 bg-gray-400 mb-1.5 rounded" />
      <span className="block w-7 h-0.5 bg-gray-400 mb-1.5 rounded" />
      <span className="block w-7 h-0.5 bg-gray-400 rounded" />
    </div>
  );
}

const QUESTIONS = {
  career: [
    'С чего мне начать?',
    'Стоит ли идти этой дорогой?',
    'Какая сфера деятельности мне подойдёт?',
    'Составь план на будущее',
    'Как развить дисциплину?'
  ],
  self: [
    'С чего мне начать?',
    'Стоит ли идти этой дорогой?',
    'Какая сфера деятельности мне подойдёт?',
    'Составь план на будущее',
    'Как развить дисциплину?',
    'Как развить дисциплину?'
  ],
  love: [
    'Как построить гармоничные отношения?',
    'Что мешает мне встретить любовь?',
    'Как понять свои чувства?',
    'Как наладить отношения с партнёром?'
  ]
};

export default function AskAI() {
  const [activeTab, setActiveTab] = useState('self');
  const [inputValue, setInputValue] = useState('');

  const handleQuestionClick = (q) => setInputValue(q);
  const handleInputChange = (e) => setInputValue(e.target.value);

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 1, filter: 'drop-shadow(0 0 10px #000) brightness(0.5) contrast(2.5)' }}
      />
      <div className="bg-white/50 relative z-10 min-h-screen">
        <div className="w-full flex flex-col items-center pb-[92px]">
          <h1 className="text-2xl font-normal text-center mt-2 font-mono">Вопрос&nbsp;AI</h1>
          <div className="flex flex-row items-center justify-start w-full max-w-xl mx-auto mb-2 px-4">
            <HamburgerIcon />
            <div className="text-left text-xs sm:text-sm md:text-base lg:text-lg font-normal text-gray-400 ml-4 w-[320px] truncate">Получи ответы на самые важные вопросы</div>
          </div>
          <hr className="w-[90%] mx-auto border-gray-300 mb-4" />
          <div className="mb-12">
            <AskAITabs active={activeTab} onChange={tab => { setActiveTab(tab); setInputValue(''); }} />
          </div>
          <div className="flex flex-col items-center w-full max-w-md mx-auto mb-24">
            {QUESTIONS[activeTab].map((q, i) => (
              <button
                key={i}
                className={`font-mono text-base transition mb-10 focus:outline-none ${inputValue === q ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}
                onClick={() => handleQuestionClick(q)}
                type="button"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="fixed left-0 right-0 bottom-[56px] z-50 w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-md mx-auto px-2 pointer-events-auto">
            <div className="flex items-center border-t border-gray-300 bg-white">
              <input
                className="flex-1 py-5 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
                placeholder="Задай свой вопрос..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button className="p-2 flex items-center justify-center" type="button">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F4F6"/><path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <BottomMenu activeIndex={0} />
      </div>
    </div>
  );
} 