import React from 'react';

export default function UserProfileHeader({ name = 'Имя', username = '@username', zodiac = [] }) {
  return (
    <div className="w-full flex flex-col items-center pt-4 pb-1 sm:pt-6 sm:pb-2 bg-white">
      <div className="flex items-center w-full px-2 md:max-w-md md:mx-auto md:px-4">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-300 mr-4 sm:mr-6 flex-shrink-0" />
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-lg sm:text-2xl font-semibold text-gray-800">{name}</span>
            <span className="text-xs sm:text-base text-gray-400">{username}</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-6 mt-2 sm:mt-3 w-full">
            {/* Пример: три знака зодиака с иконками */}
            <span className="flex items-center gap-1 text-gray-700 text-xs sm:text-lg whitespace-nowrap">
              <span className="text-base sm:text-xl">\u</span> Sagittarius
            </span>
            <span className="flex items-center gap-1 text-gray-700 text-xs sm:text-lg whitespace-nowrap">
              <span className="text-base sm:text-xl">\uC</span> Leo
            </span>
            <span className="flex items-center gap-1 text-gray-700 text-xs sm:text-lg whitespace-nowrap">
              <span className="text-base sm:text-xl">\uA</span> Gemini
            </span>
          </div>
        </div>
      </div>
      <hr className="w-[90%] mx-auto border-gray-300 mt-3 sm:mt-4" />
    </div>
  );
} 