// src/components/dashboard/TopBar.jsx
import React, { useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({onToggleRightPanel, isRightPanelOpen }) => {

  const {user} = useAuth();
  const imageUrl = user?.image 
    ? user.image 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`;

  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (query.trim()) {
        // Just navigate to Home with the query param
        navigate(`/dashboard?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <header className="h-24 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* Search Section */}
      <div className="flex-1 max-w-3xl flex items-center gap-4">
        <div className="flex-1 relative group flex items-center bg-gray-50 rounded-2xl border border-transparent focus-within:border-purple-200 focus-within:bg-white transition-all p-1">
          <Search className="ml-4 text-gray-400 w-5 h-5 group-focus-within:text-purple-500" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search for roadmaps... (e.g. 'Python', 'All' for all roadmaps)"
            className="w-full bg-transparent border-none outline-none py-3 px-4 text-gray-700 placeholder-gray-400 font-medium"
          />
        </div>
      </div>

      {/* User & Toggle Section */}
      <div className="flex items-center gap-4 ml-6">
        <button 
          onClick={onToggleRightPanel}
          className={`p-2.5 rounded-xl transition-all ${
            isRightPanelOpen ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Trophy className="w-5 h-5" />
        </button>

        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800">{user?.full_name}</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-purple-100 p-0.5 border-2 border-purple-100" onClick={()=>navigate('/profile')}>
           <img src={imageUrl} alt="avatar" className="w-full h-full rounded-full bg-white"/>
        </div>
      </div>
    </header>
  );
};

export default TopBar;