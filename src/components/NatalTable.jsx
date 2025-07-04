import React from 'react';

export default function NatalTable() {
  return (
    <div className="flex flex-col items-center mt-8 px-4 sm:px-8 w-full">
      <div className="flex w-full max-w-2xl">
        {/* Левая верхняя подпись */}
        <div className="flex flex-col justify-start items-start w-1/3">
          <span className="font-normal text-gray-400 text-lg pl-1 mb-1">З н а к и</span>
        </div>
      </div>
      <div className="flex w-full max-w-2xl">
        <table className="border border-gray-400 text-gray-500 text-base md:text-lg w-full bg-white">
          <tbody>
            {/* 12 строк */}
            {[
              ['Лев', '☉ Солнце', '1'],
              ['', '☉ Солнце', '2'],
              ['Скорпион', '☽ Луна', '3'],
              ['', '♆ Нептун', '4'],
              ['Стрелец', '', '5'],
              ['Рак', '', '6'],
              ['', '⊕ Земля', '7'],
              ['Весы', '', '8'],
              ['Дева', '⚸ Лилит', '9'],
              ['Рыбы', '', '10'],
              ['Телец', '♄ Сатурн', '11'],
              ['Водолей', '♂ Марс', '12'],
              ['Козерог', '♃ Юпитер', ''],
              ['Овен', '☿ Меркурий', ''],
            ].map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-400 px-2 py-1 w-1/3 text-left align-middle">{row[0]}</td>
                <td className="px-2 py-1 w-1/3 text-left align-middle bg-gray-100">{row[1]}</td>
                <td className="border border-gray-400 px-2 py-1 w-1/6 text-left align-middle">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex w-full max-w-2xl">
        <div className="flex flex-col justify-end items-end w-full">
          <span className="font-normal text-gray-400 text-lg pr-1 mt-1">Д о м а</span>
        </div>
      </div>
    </div>
  );
} 