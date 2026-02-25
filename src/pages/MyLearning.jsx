import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Plus, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Components & Services
import roadmapService from '../services/roadmapService';
import CourseCard from '../components/common/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyLearning = () => {
  const navigate = useNavigate();
  
  // Data State
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true); // Initial fetch loading
  const [filter, setFilter] = useState('all');

  // Modal & Generation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false); // Track generation process

  // 1. Fetch Existing Roadmaps
  useEffect(() => {
    fetchMyLearning();
  }, []);

  const fetchMyLearning = async () => {
    try {
      const data = await roadmapService.getMyRoadmaps();
      setRoadmaps(data);
    } catch (error) {
      toast.error("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle New Roadmap Generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // ✅ Close Modal First
    setIsModalOpen(false);
    
    // ✅ Then Show Full Screen Spinner
    setIsGenerating(true);

    try {
      const newRoadmap = await roadmapService.generate(topic, level);
      toast.success("Roadmap generated successfully!");
      
      // Reset form
      setTopic('');
      
      // Navigate directly
      navigate(`/roadmaps/${newRoadmap.id}`);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate roadmap. Please try again.");
      setIsGenerating(false); // Only stop loading on error (on success, we navigate away)
    }
  };

  const filteredRoadmaps = roadmaps.filter(map => {
    if (filter === 'all') return true;
    return map.status === filter;
  });

  // ✅ Show Spinner for both initial load AND generation
  if (loading || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        {isGenerating && (
          <p className="mt-4 text-purple-600 font-medium animate-pulse">
            AI is crafting your roadmap...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {/* <BookOpen className="w-6 h-6 text-purple-600" /> */}
            My Learning
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your progress across all your generated roadmaps.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Tabs */}
            {/* <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                {['all', 'in_progress', 'completed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div> */}

            {/* Generate Button (Opens Modal) */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gray-200 active:scale-95"
            >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Roadmap</span>
                <span className="sm:hidden">New</span>
            </button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {filteredRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((map) => (
            <CourseCard 
              key={map.id}
              title={map.topic}
              level={map.level}
              description={map.description}
              status={map.status}
              onStart={() => navigate(`/roadmaps/${map.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No courses found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Start your journey by creating your first personalized learning path.
            </p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="text-purple-600 font-bold hover:underline"
            >
                Create new roadmap &rarr;
            </button>
        </div>
      )}

      {/* --- GENERATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                
                {/* Close Button */}
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Create New Roadmap</h2>
                    <p className="text-gray-500 text-sm">Describe what you want to learn.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleGenerate}>
                    <div className="space-y-4">
                        
                        {/* Topic Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Topic</label>
                            <input 
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Python for Data Science"
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium"
                            />
                        </div>

                        {/* Level Dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Difficulty Level</label>
                            <div className="relative">
                                <select 
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium appearance-none cursor-pointer"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Professional">Professional</option>
                                </select>
                                <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={!topic.trim()}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-2 mt-2"
                        >
                            Generate Roadmap
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default MyLearning;