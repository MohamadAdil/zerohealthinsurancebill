// components/FaqItem.jsx
'use client';

import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';

export default function FaqItem({ id, question, answer, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-[16px] sm:text-[20px] font-semibold text-black focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        {question}
        <span
          className={`ml-4 flex flex-none items-center justify-center w-10 h-10 rounded-full text-white text-sm ${isOpen ? 'bg-[#2B8F1C]' : 'bg-[#CCCCCC]'
            }`}
        >
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>

      </button>
      {isOpen && (
        <div id={id} className="mt-6 text-[16px] text-gray-600 leading-relaxed">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
