// src/components/dashboard/SelectLevelDropdown.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectLevelDropdown = ({ onSelect }) => { // <--- Receive onSelect prop
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const handleSelect = (level) => {
    setSelectedLevel(level);
    setIsOpen(false);
    if (onSelect) onSelect(level); // <--- Send value to parent
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-36 rounded-xl border-none bg-white px-4 py-3 text-sm font-medium text-purple-600 shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {selectedLevel || 'Level'}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleSelect(level)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 ${
                  selectedLevel === level ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectLevelDropdown;