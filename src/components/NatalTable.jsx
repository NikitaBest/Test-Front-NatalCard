import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NatalTable({ chartData }) {
  const { t, language } = useLanguage();
  
  // Безопасная функция для получения переводов
  const safeTranslate = (key, fallback) => {
    const translation = t(key);
    console.log(`Translation for ${key}:`, translation, typeof translation);
    return typeof translation === 'string' ? translation : fallback;
  };
  
  // Словари для отображения знаков и планет
  const zodiacSigns = {
    1: safeTranslate('profile.signs.aries', 'Овен'), 2: safeTranslate('profile.signs.taurus', 'Телец'), 3: safeTranslate('profile.signs.gemini', 'Близнецы'), 
    4: safeTranslate('profile.signs.cancer', 'Рак'), 5: safeTranslate('profile.signs.leo', 'Лев'), 6: safeTranslate('profile.signs.virgo', 'Дева'), 
    7: safeTranslate('profile.signs.libra', 'Весы'), 8: safeTranslate('profile.signs.scorpio', 'Скорпион'), 9: safeTranslate('profile.signs.sagittarius', 'Стрелец'), 
    10: safeTranslate('profile.signs.capricorn', 'Козерог'), 11: safeTranslate('profile.signs.aquarius', 'Водолей'), 12: safeTranslate('profile.signs.pisces', 'Рыбы')
  };
  
  // Переводы для планет с fallback значениями (соответствует enum Planet с бэкенда)
  const planetNames = {
    1: safeTranslate('profile.planets.ascendant', 'Асцендент'), 2: safeTranslate('profile.planets.sun', 'Солнце'), 3: safeTranslate('profile.planets.moon', 'Луна'), 
    4: safeTranslate('profile.planets.mars', 'Марс'), 5: safeTranslate('profile.planets.mercury', 'Меркурий'), 6: safeTranslate('profile.planets.jupiter', 'Юпитер'), 
    7: safeTranslate('profile.planets.venus', 'Венера'), 8: safeTranslate('profile.planets.saturn', 'Сатурн'), 9: safeTranslate('profile.planets.rahu', 'Раху'), 
    10: safeTranslate('profile.planets.ketu', 'Кету')
  };
  
  const planetSymbols = {
    1: `${planetNames[1]} ⬆`, 2: `${planetNames[2]} ☉`, 3: `${planetNames[3]} ☽`, 4: `${planetNames[4]} ♂`, 5: `${planetNames[5]} ☿`, 
    6: `${planetNames[6]} ♃`, 7: `${planetNames[7]} ♀`, 8: `${planetNames[8]} ♄`, 9: `${planetNames[9]} ☊`, 10: `${planetNames[10]} ☋`
  };

  let tableRows = null;
  if (chartData && chartData.value && Array.isArray(chartData.value.table)) {
    // Группируем данные по домам
    const housesData = {};
    
    chartData.value.table.forEach(row => {
      const houseNumber = row.house;
      if (!housesData[houseNumber]) {
        housesData[houseNumber] = {
          house: houseNumber,
          zodiacSign: row.zodiacSign,
          planets: []
        };
      }
      
      // Добавляем планету в дом, если она есть
      if (row.planet) {
        const planetName = planetSymbols[row.planet] || row.planet;
        if (!housesData[houseNumber].planets.includes(planetName)) {
          housesData[houseNumber].planets.push(planetName);
        }
      }
    });

    // Создаем строки таблицы из сгруппированных данных
    tableRows = Object.values(housesData)
      .sort((a, b) => a.house - b.house) // Сортируем по номеру дома
      .map((houseData, i) => (
        <tr key={i}>
          <td className="border border-gray-400 px-2 py-1 w-1/6 text-center align-middle font-poppins text-sm">
            {houseData.house}
          </td>
          <td className="border border-gray-400 px-2 py-1 w-1/3 text-center align-middle font-poppins text-sm">
            {houseData.zodiacSign ? (typeof zodiacSigns[houseData.zodiacSign] === 'string' ? zodiacSigns[houseData.zodiacSign] : '') : ''}
          </td>
          <td className="px-2 py-1 w-1/3 text-center align-middle bg-gray-100">
            {houseData.planets.length > 0 ? (
              <div className="flex flex-col gap-1 items-center">
                {houseData.planets.map((planet, planetIndex) => (
                  <div key={planetIndex} className="text-sm font-poppins flex items-center justify-center">
                    {planet}
                  </div>
                ))}
              </div>
            ) : ''}
          </td>
        </tr>
      ));
  }

  return (
    <div className="flex flex-col items-center mt-8 px-4 sm:px-8 w-full">
      <div className="flex w-full max-w-2xl">
        {/* Левая верхняя подпись */}
        <div className="flex flex-col justify-start items-start w-1/3">
          <span className="font-poppins font-light text-gray-400 text-lg pl-1 mb-1">
            {language === 'en' ? 'H o u s e s' : 'Д о м а'}
          </span>
        </div>
      </div>
      <div className="flex w-full max-w-2xl">
        <table className="border border-gray-400 text-gray-500 text-base md:text-lg w-full bg-white">
          <tbody>
            {tableRows && tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr><td colSpan={3} className="text-center py-4 text-gray-400 font-poppins font-light">{safeTranslate('profile.noData', 'Нет данных для таблицы')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex w-full max-w-2xl">
        <div className="flex flex-col justify-end items-end w-full">
          <span className="font-poppins font-light text-gray-400 text-lg pr-1 mt-1">
            {language === 'en' ? 'P l a n e t s' : 'П л а н е т ы'}
          </span>
        </div>
      </div>
    </div>
  );
} 