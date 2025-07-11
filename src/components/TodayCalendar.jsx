import React from 'react';

const weekDays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function getDates() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const dates = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function TodayCalendar({ value = new Date(), onChange }) {
  const dates = getDates();

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-10 w-full max-w-md justify-center py-2">
        {dates.map((date, idx) => {
          const isSelected = date.toDateString() === value.toDateString();
          return (
            <button
              key={date.toISOString()}
              onClick={() => onChange && onChange(date)}
              className="flex flex-col items-center focus:outline-none"
              type="button"
            >
              <span className={
                'text-lg mb-1 ' +
                (isSelected ? 'text-black font-bold' : 'text-gray-600 font-normal')
              }>
                {weekDays[date.getDay()]}
              </span>
              {isSelected ? (
                <span className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-gray-800 text-white transition">
                  {date.getDate()}
                </span>
              ) : (
                <span className="text-lg text-gray-700">{date.getDate()}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 