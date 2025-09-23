import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ChatInput({ 
  onSend, 
  placeholder, 
  disabled = false, 
  loading = false, 
  isCheckingReadiness = false,
  size = 'large', // 'large' для AskAI, 'small' для Settings
  error = null,
  onFocus = null,
  onBlur = null,
  initialValue = ''
}) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState(initialValue);
  const textareaRef = useRef(null);

  // Функция для обновления высоты textarea
  const updateTextareaHeight = (textarea) => {
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 88);
    textarea.style.height = newHeight + 'px';
    
    if (textarea.scrollHeight > 88) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
    
    console.log('ChatInput height update:', { 
      scrollHeight: textarea.scrollHeight, 
      newHeight, 
      value: textarea.value.length 
    });
  };

  // Обновляем inputValue при изменении initialValue и пересчитываем высоту
  useEffect(() => {
    setInputValue(initialValue);
    
    // Пересчитываем высоту после обновления значения
    setTimeout(() => {
      if (textareaRef.current) {
        if (initialValue) {
          // Если есть начальное значение (выбран вопрос), пересчитываем высоту
          updateTextareaHeight(textareaRef.current);
        } else {
          // Если нет значения (сброс), возвращаем к исходной высоте
          textareaRef.current.style.height = '44px';
          textareaRef.current.style.overflowY = 'hidden';
        }
      }
    }, 10); // Увеличили задержку для продакшена
  }, [initialValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    updateTextareaHeight(e.target);
  };

  const handleSend = () => {
    if (!inputValue.trim() || disabled || loading || isCheckingReadiness) return;
    onSend(inputValue.trim());
    setInputValue('');
    
    // Сбрасываем высоту textarea к исходному состоянию
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px'; // Возвращаем к минимальной высоте
        textareaRef.current.style.overflowY = 'hidden'; // Скрываем скролл
        console.log('ChatInput: Сбросили высоту textarea после отправки сообщения');
      }
    }, 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Добавляем новую строку вместо отправки сообщения
      const cursorPosition = e.target.selectionStart;
      const textBefore = e.target.value.substring(0, cursorPosition);
      const textAfter = e.target.value.substring(cursorPosition);
      const newValue = textBefore + '\n' + textAfter;
      
      setInputValue(newValue);
      
      // Устанавливаем курсор после новой строки
      setTimeout(() => {
        e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        updateTextareaHeight(e.target);
      }, 0);
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      // Shift+Enter отправляет сообщение
      handleSend();
    }
  };

  const handlePaste = (e) => {
    // После вставки текста обновляем высоту
    setTimeout(() => {
      updateTextareaHeight(e.target);
    }, 10); // Увеличили задержку для продакшена
  };

  const textareaClass = size === 'large' 
    ? "flex-1 py-3 px-3 text-base font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400 resize-none"
    : "flex-1 py-3 px-3 text-sm font-mono text-gray-400 bg-transparent outline-none border-none placeholder-gray-400 resize-none";

  const buttonSize = size === 'large' ? 28 : 24;
  const circleSize = size === 'large' ? 14 : 12;

  return (
    <div className="flex items-end border-t border-gray-300 bg-white"
         style={{
           zIndex: 9999,
           // Безопасная зона для устройств с вырезами
           paddingLeft: 'env(safe-area-inset-left, 0px)',
           paddingRight: 'env(safe-area-inset-right, 0px)',
           paddingBottom: 'env(safe-area-inset-bottom, 0px)'
         }}>
      <textarea
        ref={textareaRef}
        className={textareaClass}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled || loading || isCheckingReadiness}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={1}
        style={{
          minHeight: '44px',
          maxHeight: '88px',
          lineHeight: '1.4',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: {
            display: 'none'
          },
          // Дополнительная адаптация для мобильных устройств
          fontSize: '16px', // Предотвращает зум на iOS
          transform: 'translateZ(0)', // Аппаратное ускорение
          WebkitAppearance: 'none', // Убираем стандартные стили iOS
          borderRadius: '0', // Убираем скругления для лучшей совместимости
          border: 'none',
          outline: 'none',
          resize: 'none',
          // Улучшенная прокрутка на мобильных
          WebkitOverflowScrolling: 'touch'
        }}
      />
      <button 
        className="p-2 flex items-center justify-center" 
        type="button" 
        onClick={handleSend} 
        disabled={!inputValue.trim() || disabled || loading || isCheckingReadiness}
      >
        {inputValue.trim() ? (
          <svg width={buttonSize} height={buttonSize} fill="none" viewBox={`0 0 ${buttonSize} ${buttonSize}`}>
            <circle cx={circleSize} cy={circleSize} r={circleSize} fill="#1A1A1A"/>
            <path 
              d={size === 'large' 
                ? "M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" 
                : "M9 12h6m0 0-2-2m2 2-2 2"
              } 
              stroke="#FFFFFF" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width={buttonSize} height={buttonSize} fill="none" viewBox={`0 0 ${buttonSize} ${buttonSize}`}>
            <circle cx={circleSize} cy={circleSize} r={circleSize} fill="#F3F4F6"/>
            <path 
              d={size === 'large' 
                ? "M10.5 14h7m0 0-2.5-2.5M17.5 14l-2.5 2.5" 
                : "M9 12h6m0 0-2-2m2 2-2 2"
              } 
              stroke="#A1A1AA" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {error && <div className="text-red-500 text-xs ml-2 px-2">{error}</div>}
    </div>
  );
}
