import React from 'react';

export default function NatalTable({ chartData }) {
  // Словари для отображения знаков и планет
  const zodiacSigns = {
    1: 'Овен', 2: 'Телец', 3: 'Близнецы', 4: 'Рак', 5: 'Лев', 6: 'Дева', 7: 'Весы', 8: 'Скорпион', 9: 'Стрелец', 10: 'Козерог', 11: 'Водолей', 12: 'Рыбы'
  };
  const planetSymbols = {
    1: '☉ Солнце', 2: '☽ Луна', 3: '☿ Меркурий', 4: '♀ Венера', 5: '♂ Марс', 6: '♃ Юпитер', 7: '♄ Сатурн', 8: '♅ Уран', 9: '♆ Нептун', 10: '♇ Плутон'
  };

  let tableRows = null;
  if (chartData && chartData.value && Array.isArray(chartData.value.table)) {
    tableRows = chartData.value.table.map((row, i) => (
      <tr key={i}>
        <td className="border border-gray-400 px-2 py-1 w-1/6 text-left align-middle">
          {row.house}
        </td>
        <td className="border border-gray-400 px-2 py-1 w-1/3 text-left align-middle">
          {row.zodiacSign ? zodiacSigns[row.zodiacSign] : ''}
        </td>
        <td className="px-2 py-1 w-1/3 text-left align-middle bg-gray-100">
          {row.planet ? planetSymbols[row.planet] || row.planet : ''}
        </td>
      </tr>
    ));
  }

  return (
    <div className="flex flex-col items-center mt-8 px-4 sm:px-8 w-full">
      <div className="flex w-full max-w-2xl">
        {/* Левая верхняя подпись */}
        <div className="flex flex-col justify-start items-start w-1/3">
          <span className="font-normal text-gray-400 text-lg pl-1 mb-1">Д о м а</span>
        </div>
      </div>
      <div className="flex w-full max-w-2xl">
        <table className="border border-gray-400 text-gray-500 text-base md:text-lg w-full bg-white">
          <tbody>
            {tableRows && tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr><td colSpan={3} className="text-center py-4 text-gray-400">Нет данных для таблицы</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex w-full max-w-2xl">
        <div className="flex flex-col justify-end items-end w-full">
          <span className="font-normal text-gray-400 text-lg pr-1 mt-1">П л а н е т ы</span>
        </div>
      </div>
    </div>
  );
} 