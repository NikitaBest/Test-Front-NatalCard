import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelect({ variant = 'default' }) {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { value: 'ru', flag: 'RU' },
    { value: 'en', flag: 'EN' }
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

  const handleLanguageChange = async (langValue) => {
    await changeLanguage(langValue);
    setIsOpen(false);
  };

  // Стили для разных вариантов
  const getButtonStyles = () => {
    if (variant === 'compact') {
      return "flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors";
    }
    return "flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors";
  };

  const getDropdownStyles = () => {
    if (variant === 'compact') {
      return "absolute right-0 top-full mt-2 w-16 bg-white border border-gray-200 rounded-lg shadow-lg z-50";
    }
    return "absolute right-0 top-full mt-2 w-16 bg-white border border-gray-200 rounded-lg shadow-lg z-50";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={getButtonStyles()}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Сменить язык"
      >
        <div className="flex flex-col items-center">
          {/* Буквы языка */}
          <span className="text-xs font-mono font-semibold text-gray-700">
            {language.toUpperCase()}
          </span>
          {/* Стрелка-индикатор */}
          <svg
            className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={getDropdownStyles()}>
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              className={`w-full flex items-center justify-center py-3 transition-colors ${
                language === lang.value
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageChange(lang.value)}
            >
              <span className="text-lg">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 