import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AskAITabs({ active = 'self', onChange }) {
  const { t } = useLanguage();
  
  const tabs = [
    { label: t('askAI.tabs.career'), value: 'career' },
    { label: t('askAI.tabs.self'), value: 'self' },
    { label: t('askAI.tabs.love'), value: 'love' },
  ];

  return (
    <div className="ask-ai-tabs flex items-center justify-center gap-1 mt-2 select-none max-w-xs mx-auto" style={{ position: 'relative', zIndex: 10 }}>
      {tabs.map((tab, idx) => (
        <React.Fragment key={tab.value}>
          <button
            className={
              'text-base px-2 py-1 transition rounded ' +
              (active === tab.value
                ? 'text-black font-normal underline underline-offset-4 decoration-1'
                : 'text-gray-400 font-normal')
            }
            onClick={() => onChange && onChange(tab.value)}
            type="button"
            style={{
              whiteSpace: 'nowrap',
              position: 'relative',
              zIndex: 11
            }}
          >
            {tab.label}
          </button>
          {idx < tabs.length - 1 && <span className="h-6 w-px bg-gray-300 mx-1" style={{ position: 'relative', zIndex: 10 }} />}
        </React.Fragment>
      ))}
    </div>
  );
} 