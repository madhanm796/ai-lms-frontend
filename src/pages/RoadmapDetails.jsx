import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Lock,
  FileText,
  BrainCircuit,
  Loader2,
  Flame,
  PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import roadmapService from '../services/roadmapService';
import Confetti from 'react-confetti';
import quizService from '../services/quizService';

const RoadmapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [highestUnlockedStep, setHighestUnlockedStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      const data = await roadmapService.getRoadmapById(id);
      setRoadmap(data);

      // ✅ NECESSARY LOGIC: Read 'status' from content to initialize your local states properly
      if (data && data.content) {
        const contentArray = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        
        const completed = [];
        let highest = 0;
        
        contentArray.forEach((step, idx) => {
            if (step.status === 'completed') {
                completed.push(idx);
                highest = Math.max(highest, idx + 1);
            }
        });

        setCompletedSteps(completed);
        setHighestUnlockedStep(highest);
        setActiveStep(highest < contentArray.length ? highest : highest - 1);
      }
    } catch (error) {
      toast.error("Failed to load roadmap.");
      navigate('/my-learning');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    if (index > highestUnlockedStep) {
      toast.error("Complete previous steps to unlock this!", { icon: '🔒' });
      return;
    }
    setActiveStep(activeStep === index ? null : index);
  };

  const handleMarkCompleted = async (e, index) => {
    e.stopPropagation(); 
    
    try {
        const response = await roadmapService.updateStepProgress(id, index);
        
        // 1. Show Gamification Toast!
        if (response.xp_gained > 0) {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold text-green-600">+{response.xp_gained} XP!</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" /> 
                        {response.new_streak} Day Streak
                    </span>
                </div>, 
                { duration: 4000 }
            );
        }

        // ✅ NECESSARY LOGIC: Update your state arrays so the progress bar moves
        if (!completedSteps.includes(index)) {
            setCompletedSteps(prev => [...prev, index]);
            setHighestUnlockedStep(prev => Math.max(prev, index + 1));
        }

        // 2. Update Local State immediately
        const updatedRoadmap = { ...roadmap };
        updatedRoadmap.content[index].status = 'completed';
        
        const nextIndex = index + 1;
        if (nextIndex < updatedRoadmap.content.length) {
            updatedRoadmap.content[nextIndex].status = 'current';
            setTimeout(() => setActiveStep(nextIndex), 300); // Auto-advance visually
        } else {
            // It was the last step
            toast.success("All steps completed! Take the quiz to finish.", { icon: '🎓', duration: 4000 });
        }
        
        setRoadmap(updatedRoadmap);

    } catch (error) {
        console.error(error);
        toast.error("Failed to save progress.");
    }
  };


  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);
    const loadingToast = toast.loading("AI is analyzing the roadmap and crafting your quiz...", { icon: '🧠' });

    try {
      const newQuiz = await quizService.generateQuiz(roadmap.topic, roadmap.level);
      
      toast.success("Quiz generated successfully!", { id: loadingToast });
      navigate(`/quiz/${newQuiz.id}`);

    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz. Please try again.", { id: loadingToast });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!roadmap) return null;

  const steps = Array.isArray(roadmap.content)
    ? roadmap.content
    : (typeof roadmap.content === 'string' ? JSON.parse(roadmap.content) : []);

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);
  const isAllStepsCompleted = completedSteps.length === steps.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* --- 1. HEADER --- */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 pt-8 pb-20 rounded-b-[3rem] shadow-xl relative z-10">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full mb-6 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">{roadmap.topic}</h1>

          <p className="text-purple-100 text-lg opacity-90 leading-relaxed mb-6">
            {roadmap.description || `Master ${roadmap.topic} with this structured learning path.`}
          </p>

          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. STEPS LIST --- */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 -mt-12 pb-32 z-20">
        <div className="flex flex-col gap-4">

          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = completedSteps.includes(index);
            const isLocked = index > highestUnlockedStep;

            return (
              <div
                key={index}
                className={`
                  relative rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isLocked ? 'bg-gray-100 border-gray-200 opacity-70' : 'bg-white shadow-sm border-transparent hover:border-purple-200'}
                  ${isActive ? 'ring-2 ring-purple-500 shadow-xl scale-[1.02] z-10' : ''}
                `}
              >
                <button
                  onClick={() => toggleStep(index)}
                  disabled={isLocked}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors shrink-0
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${!isCompleted && !isLocked ? 'bg-purple-100 text-purple-600' : ''}
                      ${isLocked ? 'bg-gray-200 text-gray-400' : ''}
                    `}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> :
                        isLocked ? <Lock className="w-5 h-5" /> :
                          (index + 1)}
                    </div>

                    <div>
                      <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                        {step.title || step.topic}
                      </h3>
                      {isLocked && <span className="text-xs text-gray-400 font-medium uppercase">Locked</span>}
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="text-gray-400">
                      {isActive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </button>

                {isActive && !isLocked && (
                  <div className="px-5 pb-8 pt-2 pl-[4.5rem] animate-in slide-in-from-top-2">

                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      {step.content || step.description}
                    </p>

                    {step.resources?.length > 0 && (
                      <div className="mb-8 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resources</h4>
                        {step.resources.map((res, i) => (
                          <a
                            key={i} href={res.url} target="_blank" rel="noreferrer"
                            className="block p-3 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-100 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              {res.type === 'video' ? (
                                <PlayCircle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                              )}
                              <span className="font-medium text-gray-700 group-hover:text-purple-700">{res.title}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => handleMarkCompleted(e, index)}
                      disabled={isCompleted}
                      className={`
                        w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                        ${isCompleted
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200 active:scale-95'}
                      `}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Step Completed
                        </>
                      ) : (
                        "Mark as Completed & Continue"
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-200 z-30 flex justify-center">
        <button
          onClick={handleStartQuiz}
          disabled={!isAllStepsCompleted || isGeneratingQuiz}
          className={`
            group flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-2xl transition-all
            ${isAllStepsCompleted && !isGeneratingQuiz
              ? 'bg-purple-600 text-white hover:scale-105 hover:bg-purple-700 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isGeneratingQuiz ? (
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          ) : isAllStepsCompleted ? (
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          ) : (
            <Lock className="w-5 h-5" />
          )}

          <span className="text-lg">
            {isGeneratingQuiz
              ? "Generating Quiz..."
              : isAllStepsCompleted
                ? "Take Final Quiz"
                : "Complete All Steps to Unlock Quiz"
            }
          </span>
        </button>
      </div>

    </div>
  );
};

export default RoadmapDetails;