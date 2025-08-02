import React from 'react';

export default function ProfileInfoBlock({ title, text, children, index = 0 }) {
  // Чередуем изображения для фона
  const backgroundImage = index % 2 === 0 ? '/img_12.png' : '/imm12.png';
  
  // Позиционируем изображение в разнобой: 0 - справа, 1 - слева, 2 - справа
  const positions = ['right top', 'left top', 'right top'];
  const position = positions[index % 3];
  
  // Чередуем размеры планет: 70% и 50%
  const sizes = ['70%', '50%'];
  const size = sizes[index % 2];
  
  return (
    <div className="w-full flex flex-col items-center mt-40 mb-40 px-4 relative overflow-visible">
      {/* Фоновое изображение - выходит за границы блока */}
      <div 
        className="absolute w-full h-full opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: size,
          backgroundPosition: position,
          backgroundRepeat: 'no-repeat',
          filter: 'blur(0px)',
          top: '-25%',
          left: position.includes('left') ? '-25%' : '0%',
          width: '150%',
          height: '150%',
        }}
      />
      
      {/* Максимально прозрачный матовый блок с текстом */}
      <div className="relative z-10 w-full backdrop-blur-sm bg-white/5 rounded-xl p-6">
        <h2 className="font-poppins text-2xl font-light text-gray-800 mb-4 w-full text-left">{title}</h2>
        <div
          className="text-base text-gray-900 font-poppins font-light w-full text-left"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {children && <div className="mt-6 w-full flex justify-center">{children}</div>}
      </div>
    </div>
  );
}
