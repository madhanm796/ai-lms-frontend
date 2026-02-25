import React from 'react';

const SectionHeader = ({ title, children }) => {
  return (
    <div className="flex items-center gap-4 w-full mb-6">
      {/* Title Text */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
        {/* Render 'title' prop if provided, otherwise render children (for complex text) */}
        {title || children}
      </h2>
      
      {/* The Divider Line (Fills remaining space) */}
      <div className="h-px bg-gray-200 flex-1 rounded-full"></div>
    </div>
  );
};

export default SectionHeader;