import React, { useEffect, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import StatCard from './StatCard';
import LeaderboardPodium from './LeaderboardPodium'; 
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; // ✅ Import your API instance

const RightPanel = () => {
    const { user } = useAuth();
    
    // ✅ State for Data & Loading
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Logic
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Adjust this URL to match your backend route
                const response = await api.get('/users/leaderboard'); 
                
                setLeaderboardData(response.data);
            } catch (error) {
                console.error("Failed to load leaderboard", error);
                setLeaderboardData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Split logic: Top 3 vs Rest
    const topThree = leaderboardData.slice(0, 3);
    const restOfUsers = leaderboardData.slice(3);

    return (
        <div className="bg-white p-6 h-full overflow-y-auto flex flex-col gap-8">

            {/* 1. Podium Section */}
            <div>
                <SectionHeader title="Leaderboard" />
                {loading ? (
                    // Simple loading placeholder for podium
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-3xl animate-pulse text-gray-400 text-sm">
                        Loading Ranking...
                    </div>
                ) : (
                    <LeaderboardPodium topUsers={topThree} />
                )}
            </div>

            {/* 2. The Rest of the List */}
            <div className="space-y-3">
                {loading ? (
                    // Loading skeleton for list items
                    <div className="space-y-3">
                         {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    restOfUsers.map((item, index) => {
                        // Check if this item is the current user
                        const isCurrentUser = user?.id === item.id;

                        return (
                            <div key={item.id} className={`flex items-center gap-3 p-3 ${isCurrentUser ? 'bg-black' : 'bg-gray-50'} rounded-xl transition-colors`}>
                                <span className="text-sm font-bold text-gray-400">#{index + 4}</span>
                                
                                <img 
                                    src={item.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.email || item.name}`} 
                                    className="w-8 h-8 rounded-full bg-white" 
                                    alt="avatar" 
                                />
                                
                                <div className="flex-1">
                                    <p className={`text-sm font-bold capitalize ${isCurrentUser ? 'text-purple-400' : 'text-gray-700'}`}>
                                        {item.name || item.full_name}
                                    </p>
                                    <p className={`text-xs ${isCurrentUser ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {item.xp} points
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {!loading && leaderboardData.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No users found.</p>
                )}
            </div>

            {/* 3. Scoring Section (Unchanged) */}
            <div className="mt-auto"> 
                <SectionHeader title="Scoring" />
                <div className="flex gap-4">
                    <StatCard value={user?.xp || 0} label="points" color="purple" />
                    <StatCard value={user?.current_streak || 0} label="days" color="red" />
                </div>
                
                {/* Legend */}
                <div className="flex gap-6 mt-4 justify-center">
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 bg-purple-500 rounded-sm'></div>
                        <span className='font-medium text-sm text-gray-600'>XP</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 bg-red-500 rounded-sm'></div>
                        <span className='font-medium text-sm text-gray-600'>Streaks</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RightPanel;