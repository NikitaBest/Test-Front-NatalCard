import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function BottomMenu({ activeIndex = 0, isNavigationDisabled = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const menu = [
    { label: t('navigation.settings'), path: '/settings' },
    { label: 'LIA', path: '/ask-ai' },
    { label: t('navigation.profile'), path: '/profile' },
    { label: t('navigation.today'), path: '/today' },
  ];

  const handleNavigation = (path) => {
    if (!isNavigationDisabled) {
      navigate(path);
    }
  };

  return (
    <nav 
      className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-300 transition-all duration-300"
      style={{
        transform: isNavigationDisabled ? 'translateY(100%)' : 'translateY(0)',
        opacity: isNavigationDisabled ? 0 : 1,
        zIndex: 1000
      }}
    >
      <div className="flex justify-between items-center px-1 pt-3 pb-8 max-w-lg mx-auto">
        {menu.map((item, idx) => (
          <button
            key={item.label}
            className={
              'flex-1 text-center font-sans outline-none whitespace-nowrap ' +
              'text-xs sm:text-sm md:text-base transition ' +
              (activeIndex === idx
                ? 'text-black font-semibold'
                : isNavigationDisabled
                ? 'text-gray-300 font-normal cursor-not-allowed'
                : 'text-gray-400 font-normal hover:text-gray-600')
            }
            onClick={() => handleNavigation(item.path)}
            type="button"
            disabled={activeIndex === idx || isNavigationDisabled}
            style={{ 
              cursor: activeIndex === idx || isNavigationDisabled ? 'default' : 'pointer', 
              background: 'none', 
              border: 'none', 
              padding: 0,
              opacity: isNavigationDisabled && activeIndex !== idx ? 0.5 : 1
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
} 