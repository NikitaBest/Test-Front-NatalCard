import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelect({ variant = 'default' }) {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.value === language);

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langValue) => {
    changeLanguage(langValue);
    setIsOpen(false);
  };

  // Стили для разных вариантов
  const getButtonStyles = () => {
    if (variant === 'compact') {
      return "flex items-center justify-between px-3 py-1 text-sm font-mono text-gray-700 bg-transparent border border-gray-300 rounded-lg outline-none cursor-pointer hover:bg-gray-50 transition-colors";
    }
    return "flex items-center justify-between w-full px-3 py-2 text-sm font-mono text-gray-700 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-50 transition-colors rounded";
  };

  const getDropdownStyles = () => {
    if (variant === 'compact') {
      return "absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50";
    }
    return "absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={getButtonStyles()}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span className="mr-2">{currentLanguage?.flag}</span>
          <span>{currentLanguage?.label}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={getDropdownStyles()}>
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              className={`w-full flex items-center px-4 py-3 text-sm font-mono transition-colors ${
                language === lang.value
                  ? 'bg-gray-100 text-gray-800 border-l-4 border-gray-400'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageChange(lang.value)}
            >
              <span className="mr-3">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {language === lang.value && (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 