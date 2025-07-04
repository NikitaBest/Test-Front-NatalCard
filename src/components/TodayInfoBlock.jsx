import React from 'react';

export default function TodayInfoBlock({
  title = 'Солнце в Стрельце',
  tips = [
    { icon: '⭐', text: 'Сегодня вас ждет лучший день в вашей жизни' },
    { icon: '🌱', text: 'Будьте осторожнее в первой половине дня' },
  ],
  image,
  blocks = [
    {
      title: 'Ваше Солнце',
      text: 'определяет ваше эго, идентичность и главную роль в жизни. Находясь в знаке Стрельца, оно наделяет вас неутомимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.'
    },
    {
      title: 'Ваша Луна',
      text: 'определяет ваше эго, идентичность и главную роль в жизни. Находясь в знаке Стрельца, оно наделяет вас неутомимой жаждой познания и стремлением к свободе. Ваша сила — в поиске смысла и расширении границ, как физических, так и интеллектуальных. Вы здесь, чтобы учиться и вдохновлять других своим оптимизмом.'
    }
  ]
}) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-8">
      <h2 className="font-mono text-xl font-normal text-gray-800 mb-4 mt-6 text-left">{title}</h2>
      <ul className="mb-4">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-center gap-2 text-sm mb-2 text-gray-900">
            <span className="text-lg">{tip.icon}</span>
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
      {image && (
        <div className="mb-4 flex justify-center">
          {image}
        </div>
      )}
      {blocks.map((block, i) => (
        <div key={i} className="mb-4">
          <div className="font-bold text-base mb-1">{block.title}</div>
          <div className="text-sm text-gray-900 font-sans whitespace-pre-line">{block.text}</div>
        </div>
      ))}
      <hr className="w-full border-gray-300 mt-6" />
    </div>
  );
} 