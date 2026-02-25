import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Container for the spinner and text */}
      <div className="relative flex items-center justify-center">
        
        {/* The Spinning Ring */}
        {/* h-32 w-32 = 128px size. border-purple-500 matches your theme */}
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
        
        {/* The Static Text */}
        <div className="absolute font-semibold text-gray-700 text-sm animate-pulse">
          Working on it...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;