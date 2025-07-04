import React from 'react';

export default function NatalChartSquare() {
  return (
    <div className="flex justify-center items-center mt-8">
      <svg
        viewBox="0 0 320 320"
        width="80vw"
        height="80vw"
        style={{ maxWidth: 360, maxHeight: 360 }}
        className="bg-white border border-black"
      >
        {/* Внешний квадрат */}
        <rect x="1" y="1" width="318" height="318" fill="none" stroke="#222" strokeWidth="2" />
        {/* Диагонали */}
        <line x1="1" y1="1" x2="319" y2="319" stroke="#222" strokeWidth="2" />
        <line x1="319" y1="1" x2="1" y2="319" stroke="#222" strokeWidth="2" />
        {/* Перекрестные линии */}
        <line x1="160" y1="1" x2="1" y2="160" stroke="#222" strokeWidth="2" />
        <line x1="160" y1="1" x2="319" y2="160" stroke="#222" strokeWidth="2" />
        <line x1="160" y1="319" x2="1" y2="160" stroke="#222" strokeWidth="2" />
        <line x1="160" y1="319" x2="319" y2="160" stroke="#222" strokeWidth="2" />
      </svg>
    </div>
  );
} 