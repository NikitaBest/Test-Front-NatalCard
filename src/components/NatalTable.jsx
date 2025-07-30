import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NatalTable({ chartData }) {
  const { t } = useLanguage();
  
  // Словари для отображения знаков и планет
  const zodiacSigns = {
    1: t('profile.signs.aries'), 2: t('profile.signs.taurus'), 3: t('profile.signs.gemini'), 
    4: t('profile.signs.cancer'), 5: t('profile.signs.leo'), 6: t('profile.signs.virgo'), 
    7: t('profile.signs.libra'), 8: t('profile.signs.scorpio'), 9: t('profile.signs.sagittarius'), 
    10: t('profile.signs.capricorn'), 11: t('profile.signs.aquarius'), 12: t('profile.signs.pisces')
  };
  const planetSymbols = {
    1: '☉ Солнце', 2: '☽ Луна', 3: '☿ Меркурий', 4: '♀ Венера', 5: '♂ Марс', 
    6: '♃ Юпитер', 7: '♄ Сатурн', 8: '♅ Уран', 9: '♆ Нептун', 10: '♇ Плутон'
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
          <td className="border border-gray-400 px-2 py-1 w-1/6 text-left align-middle">
            {houseData.house}
          </td>
          <td className="border border-gray-400 px-2 py-1 w-1/3 text-left align-middle">
            {houseData.zodiacSign ? zodiacSigns[houseData.zodiacSign] : ''}
          </td>
          <td className="px-2 py-1 w-1/3 text-left align-middle bg-gray-100">
            {houseData.planets.length > 0 ? (
              <div className="flex flex-col gap-1">
                {houseData.planets.map((planet, planetIndex) => (
                  <div key={planetIndex} className="text-sm">
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
          <span className="font-normal text-gray-400 text-lg pl-1 mb-1">{t('profile.houses')}</span>
        </div>
      </div>
      <div className="flex w-full max-w-2xl">
        <table className="border border-gray-400 text-gray-500 text-base md:text-lg w-full bg-white">
          <tbody>
            {tableRows && tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr><td colSpan={3} className="text-center py-4 text-gray-400">{t('profile.noData')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex w-full max-w-2xl">
        <div className="flex flex-col justify-end items-end w-full">
          <span className="font-normal text-gray-400 text-lg pr-1 mt-1">{t('profile.planets')}</span>
        </div>
      </div>
    </div>
  );
} 