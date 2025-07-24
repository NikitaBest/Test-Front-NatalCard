import React from 'react';

export default function ProfileInfoBlock({ title, text, children }) {
  return (
    <div className="w-full flex flex-col items-center mt-8 mb-8 px-4">
      <h2 className="font-mono text-2xl font-normal text-gray-800 mb-4 w-full text-left">{title}</h2>
      <div
        className="text-base text-gray-900 font-sans w-full text-left mb-6"
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {children && <div className="mb-6 w-full flex justify-center">{children}</div>}
      <hr className="w-full border-gray-300 mt-4" />
    </div>
  );
}
