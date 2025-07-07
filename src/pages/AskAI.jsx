import BottomMenu from '../components/BottomMenu';
import AskAITabs from '../components/AskAITabs';
import { useState } from 'react';
import planetGif from '../assets/planet.gif';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuestionClick = (q) => {
    setInputValue(q);
    setShowAnswer(false);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowAnswer(false);
  };
  const handleSend = () => {
    if (inputValue.trim()) {
      setLoading(true);
      setShowAnswer(false);
      setTimeout(() => {
        setLoading(false);
        setShowAnswer(true);
      }, 2000); // имитация задержки ответа
    }
  };

  const staticAnswer = (
    <div className="w-full max-w-md mx-auto bg-white/80 rounded-xl shadow-none mb-8 px-4 py-8 flex flex-col items-center">
      <h2 className="text-2xl font-normal text-center mb-6 mt-2 font-mono">Ответ на ваш вопрос</h2>
      <div className="text-base sm:text-lg text-gray-800 font-sans text-left mb-6 w-full">
        <b>Ваше Солнце</b> определяет ваше эго, идентичность и главную роль в жизни.  Находясь в знаке Стрельца, оно наделяет вас неутолимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.
      </div>
      <ol className="text-base sm:text-lg text-gray-800 font-sans text-left mb-6 w-full list-decimal pl-6">
        <li>определяет ше эго, идентичность и главную роль в жизни.  Находясь в знаке Стрельца, оно наделяет вас неутолимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.</li>
        <li>определяет ваше эго, идентичность и главную роль в жизни.  Находясь в знаке Стрельца, оно наделяет вас неутолимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.</li>
      </ol>
      <div className="text-base sm:text-lg text-gray-800 font-sans text-left w-full">
        <b>Находясь в знаке Стрельца</b>, оно наделяет вас неутолимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.
      </div>
      <button className="mt-10 w-full max-w-xs h-12 bg-black text-white rounded-xl text-lg font-mono" onClick={() => setShowAnswer(false)}>Назад</button>
    </div>
  );

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
      <img
        src="/bg2.png"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] max-w-none h-auto z-0"
        style={{ opacity: 1, filter: 'drop-shadow(0 0 10px #000) brightness(0.5) contrast(2.5)' }}
      />
      <div className="bg-white/50 relative z-10 min-h-screen">
        {loading && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={planetGif}
                alt="Загрузка..."
                className="w-40 h-40 aspect-square object-cover rounded-full opacity-90"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </AnimatePresence>
        )}
        <div className="w-full flex flex-col items-center pb-[92px]">
          <h1 className="text-2xl font-normal text-center mt-2 font-mono">Вопрос&nbsp;AI</h1>
          <div className="flex flex-row items-center justify-start w-full max-w-xl mx-auto mb-2 px-4">
            <HamburgerIcon />
            <div className="text-left text-xs sm:text-sm md:text-base lg:text-lg font-normal text-gray-400 ml-4 w-[320px] truncate">Получи ответы на самые важные вопросы</div>
          </div>
          <hr className="w-[90%] mx-auto border-gray-300 mb-4" />
          <div className="mb-12">
            <AskAITabs active={activeTab} onChange={tab => { setActiveTab(tab); setInputValue(''); setShowAnswer(false); }} />
          </div>
          {/* Ответ */}
          <AnimatePresence mode="wait">
            {showAnswer && (
              <motion.div
                key="ai-answer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex flex-col items-center"
              >
                {staticAnswer}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col items-center w-full max-w-md mx-auto mb-24">
            {!showAnswer && QUESTIONS[activeTab].map((q, i) => (
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
            {!showAnswer && (
              <div className="flex items-center border-t border-gray-300 bg-white">
                <input
                  className="flex-1 py-5 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400"
                  placeholder="Задай свой вопрос..."
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={showAnswer || loading}
                />
                <button className="p-2 flex items-center justify-center" type="button" onClick={handleSend} disabled={!inputValue.trim() || showAnswer || loading}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F4F6"/><path d="M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <BottomMenu activeIndex={0} />
      </div>
    </div>
  );
} 