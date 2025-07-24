import React from 'react';
import { useNavigate } from 'react-router-dom';

const menu = [
  { label: 'Вопрос AI', path: '/ask-ai' },
  { label: 'Настройки', path: '/settings' },
  { label: 'На меня', path: '/profile' },
  { label: 'На сегодня', path: '/today' },
];

export default function BottomMenu({ activeIndex = 2 }) {
  const navigate = useNavigate();
  return (
    <nav className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-300 z-50">
      <div className="flex justify-between items-center px-1 pt-3 pb-8 max-w-lg mx-auto">
        {menu.map((item, idx) => (
          <button
            key={item.label}
            className={
              'flex-1 text-center font-sans outline-none whitespace-nowrap ' +
              'text-xs sm:text-sm md:text-base transition ' +
              (activeIndex === idx
                ? 'text-black font-semibold'
                : 'text-gray-400 font-normal')
            }
            onClick={() => navigate(item.path)}
            type="button"
            disabled={activeIndex === idx}
            style={{ cursor: activeIndex === idx ? 'default' : 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
} 