import React from 'react';
import { CheckCircle, Lock, ChevronDown, ExternalLink, PlayCircle, BookOpen } from 'lucide-react';

const RoadmapStep = ({ step, index, isLast, status, isExpanded, onToggle, onComplete }) => {
  
  // 1. Determine Icon based on Status (Completed, Current, Locked)
  const renderIcon = () => {
    if (status === 'completed') return <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />;
    if (status === 'current') return <PlayCircle className="w-6 h-6 text-purple-600 fill-purple-50 animate-pulse" />;
    return <Lock className="w-5 h-5 text-gray-300" />;
  };

  // 2. Dynamic Styles for the Card Border & Ring
  const getCardStyles = () => {
    if (status === 'current') return 'border-purple-200 ring-4 ring-purple-50/50 shadow-md';
    if (status === 'completed') return 'border-green-200';
    return 'border-gray-100 opacity-60'; // Dim locked items
  };

  return (
    <div className={`flex gap-4 ${status === 'locked' ? 'grayscale-[0.5]' : ''}`}>
      
      {/* Left Timeline Column */}
      <div className="flex flex-col items-center">
        {/* The Icon */}
        <div className="relative z-10 bg-white p-1 rounded-full">
            {renderIcon()}
        </div>
        
        {/* The Vertical Line (Hide for last item) */}
        {!isLast && (
          <div className={`w-0.5 grow my-1 ${status === 'completed' ? 'bg-green-200' : 'bg-gray-100'}`}></div>
        )}
      </div>

      {/* Right Content Column */}
      <div className="flex-1 mb-6">
        
        {/* Card Header (Clickable only if NOT locked) */}
        <div 
          onClick={() => status !== 'locked' && onToggle()}
          className={`
            bg-white border rounded-2xl p-5 transition-all duration-300 
            ${getCardStyles()} 
            ${status !== 'locked' ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`font-bold text-lg ${status === 'completed' ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-800'}`}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {step.duration || '1 hour'} • {step.type || 'Lesson'}
              </p>
            </div>
            
            {/* Show Arrow only if unlocked */}
            {status !== 'locked' && (
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            )}
          </div>

          {/* Expanded Content (Only if unlocked) */}
          {isExpanded && status !== 'locked' && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {step.description || "Master the core concepts of this module to advance to the next level."}
              </p>

              {/* Resources List */}
              {step.resources && step.resources.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Resources</h4>
                  {step.resources.map((res, i) => (
                    <a 
                      key={i} 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-purple-50 text-sm group transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700 group-hover:text-purple-700 underline-offset-2 group-hover:underline truncate">
                        {res.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 ml-auto" />
                    </a>
                  ))}
                </div>
              )}

              {/* Mark as Complete Button */}
              {status !== 'completed' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Stop accordion from closing
                    onComplete(step.id);
                  }}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;