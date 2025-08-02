import React from 'react';

export default function TodayInfoBlock({ blocks = [] }) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-8">
      {blocks.map((block, i) => (
        <div key={i} className="mb-8">
          <h2 className="font-poppins text-xl font-light text-gray-800 mb-4 mt-6 text-left">{block.title}</h2>
          {block.tips && block.tips.length > 0 && (
            <ul className="mb-4">
              {block.tips.map((tip, j) => (
                <li key={j} className="flex items-center gap-2 text-sm mb-2 text-gray-900 font-poppins font-light">
                  <span className="text-lg">{tip.icon}</span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          )}
          {block.image && (
            <div className="mb-4 flex justify-center">
              <img src={block.image} alt="symbol" className="w-24 h-24 object-contain rounded-full" />
            </div>
          )}
          <div
            className="text-sm text-gray-900 font-poppins font-light whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
          <hr className="w-full border-gray-300 mt-6" />
        </div>
      ))}
    </div>
  );
} 