import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileTabs({ active = 'map', onChange }) {
  const { t } = useLanguage();
  
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
        {t('profile.tabs.map')}
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
        {t('profile.tabs.table')}
      </button>
    </div>
  );
} 