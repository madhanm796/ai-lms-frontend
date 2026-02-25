import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import RightPanel from './dashboard/RightPanel';

const MainLayout = () => {
  // ✅ State to control visibility (Default: true on desktop)
  const [showRightPanel, setShowRightPanel] = useState(false);

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* ✅ Pass the toggle function to TopBar */}
        <TopBar 
          isRightPanelOpen={showRightPanel}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)} 
        />
        
        <main className="flex-1 p-8 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>

      {/* 3. Right Panel (Leaderboard) with Animation */}
      {/* ⚠️ CHANGE: We wrapped RightPanel in an <aside> tag.
          Instead of unmounting it, we animate width from w-80 to w-0.
      */}
      <aside 
        className={`
          sticky top-0 h-screen bg-white
          transition-all duration-500 ease-in-out overflow-hidden
          ${showRightPanel 
            ? 'w-80 opacity-100 border-l border-gray-100 translate-x-0' // OPEN STATE
            : 'w-0 opacity-0 border-none translate-x-20'                 // CLOSED STATE
          }
        `}
      >
        {/* ⚠️ IMPORTANT: This inner div must have a fixed width (w-80).
           This prevents the text inside from squishing as the parent shrinks.
        */}
        <div className="w-80 h-full">
          <RightPanel />
        </div>
      </aside>

    </div>
  );
};

export default MainLayout;