import React from 'react';

const CourseCard = ({ title, description, level, onStart }) => {

  // ✅ Define colors for each level
  const levelColors = {
    Beginner: "text-green-600 bg-green-50 border-green-100",
    Intermediate: "text-blue-600 bg-blue-50 border-blue-100",
    Advanced: "text-orange-600 bg-orange-50 border-orange-100",
    Professional: "text-red-600 bg-red-50 border-red-100",
    default: "text-gray-600 bg-gray-50 border-gray-100" // Fallback
  };

  // ✅ Get the correct class based on the prop, or use default
  const badgeClass = levelColors[level] || levelColors.default;

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{title}</h3>
        
        {/* Dynamic Badge */}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeClass} whitespace-nowrap`}>
          {level || "General"}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-500 text-sm mb-6 grow line-clamp">
        {description || "Start your journey to master this skill. This roadmap covers all essential topics."}
      </p>

      {/* Button */}
      <button 
        onClick={onStart}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm shadow-purple-100 active:scale-95"
      >
        Start Learning
      </button>
    </div>
  );
};

export default CourseCard;