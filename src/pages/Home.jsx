import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Ghost } from 'lucide-react';
import toast from 'react-hot-toast';
import {useAuth} from '../context/AuthContext';

// Components & Services
import CourseCard from '../components/common/CourseCard';
import SectionHeader from '../components/common/SectionHeader';
import SelectLevelDropdown from '../components/dashboard/SelectLevelDropDown';
import LoadingSpinner from '../components/LoadingSpinner';
import roadmapService from '../services/roadmapService';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || ''; // Get ?q=Python

  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {user} = useAuth();
  

  // State for Generation (Plan B)
  const [selectedLevel, setSelectedLevel] = useState('Beginner');

  // 1. Fetch Data when Search Query Changes
  useEffect(() => {
    const fetchRoadmaps = async () => {
      setIsLoading(true);

        try {
          let results = null;
          if (searchQuery || searchQuery != 'all') {
            results = await roadmapService.search(searchQuery);
          }
          else {
            results = await roadmapService.getAll();
          }
          setRoadmaps(results || []);
        } catch (error) {
          console.log("No roadmaps found.");
          toast.error("Could not fetch roadmaps");
        } finally {
          setIsLoading(false);
        }
    };

    fetchRoadmaps();
  }, [searchQuery]);

  // 2. Handle Generate New (The "Create" Action)
  const handleGenerate = async () => {
    if (!searchQuery || searchQuery == 'all') {
      toast.error("Please enter a topic in the search bar first");
      return;
    }
    setIsGenerating(true);
    try {
      console.log(searchQuery, selectedLevel);
      const data = await roadmapService.generate(searchQuery, selectedLevel);
      toast.success("Roadmap generated!");
      // navigate(`/roadmaps/${data.id}`);
    } catch (error) {
      toast.error("Generation failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRoadmapClick = (roadmap) => {
    // Check if the roadmap belongs to the current user

    console.log(roadmap);

    console.log(roadmap?.user_id, user?.id);
    if (roadmap?.user_id !== user?.id) {
      toast.error("You can only start roadmaps you generated yourself. Feature yet to be added!", {
        icon: '🔒',
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#1f2937', // dark gray
          color: '#fff',
        },
      });
      return; // Stop execution, don't navigate
    };
    navigate(`/roadmaps/${roadmap.id}`)
  }

  return (
    <div>
      {/* Loading Overlay for Generation */}
      {isGenerating && <LoadingSpinner />}

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <SectionHeader>
          {searchQuery ? (
            <>Result for - <span className="text-gray-400">“{searchQuery}”</span></>
          ) : (
            "Roadmaps"
          )}
        </SectionHeader>

        {/* ✅ OPTION 1: "Create New" Button (Only shows if we have results) */}
        {/* {roadmaps.length > 0 && searchQuery && (
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <SelectLevelDropdown onSelect={setSelectedLevel} />
            </div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-purple-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create New</span>
            </button>
          </div>
        )} */}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>
      ) : (
        <>
          {/* A. Results Found */}

          {/* {console.log(roadmaps)} */}
          {roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {roadmaps.map((map) => (
                <CourseCard
                  key={map.id}
                  title={map.topic} // Assuming API returns 'topic'
                  level={map.level}
                  description={map.description}
                  onStart={() => handleRoadmapClick(map) }
                />
              ))}
            </div>
          ) : (

            // B. No Results Found -> Show Generation Option
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Ghost className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No roadmaps found for "{searchQuery}"</h3>
              <p className="text-gray-500 max-w-md mb-8">
                It seems no one has created this yet. Be the first to generate an AI-powered learning path!
              </p>

              {/* ✅ OPTION 2: The Big Generate Section */}
              <div className="bg-white p-2 pl-2 pr-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-2">
                <div className="pl-4 pr-2 py-2 font-medium text-gray-500">
                  Generate <span className="text-purple-600 font-bold">{searchQuery}</span> for
                </div>

                <div className="w-full sm:w-auto">
                  <SelectLevelDropdown onSelect={setSelectedLevel} />
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Generate Now
                </button>
              </div>
            </div>

          )}
        </>
      )}
    </div>
  );
};

export default Home;