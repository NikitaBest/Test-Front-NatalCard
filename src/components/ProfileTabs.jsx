import React from 'react';

export default function ProfileTabs({ active = 'map', onChange }) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-6 select-none">
      <button
        className={
          'text-lg px-2 transition ' +
          (active === 'map'
            ? 'text-black font-medium border-b-2 border-black'
            : 'text-gray-400 font-normal border-b-2 border-transparent')
        }
        onClick={() => onChange && onChange('map')}
        type="button"
      >
        Карта
      </button>
      <span className="h-6 w-px bg-gray-300 mx-2" />
      <button
        className={
          'text-lg px-2 transition ' +
          (active === 'table'
            ? 'text-black font-medium border-b-2 border-black'
            : 'text-gray-400 font-normal border-b-2 border-transparent')
        }
        onClick={() => onChange && onChange('table')}
        type="button"
      >
        Таблица
      </button>
    </div>
  );
} 