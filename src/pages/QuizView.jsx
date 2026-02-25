import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, ChevronRight, CheckCircle, XCircle, RotateCcw, Award, ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import quizService from '../services/quizService'; // Assuming you have this service
import roadmapService from '../services/roadmapService';

const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz Interaction States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [isFinished, setIsFinished] = useState(false);
  const [scoreData, setScoreData] = useState({ percentage: 0, correctCount: 0 });
  const [isCompleting, setIsCompleting] = useState(false); // ✅ Add this state

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const data = await quizService.getQuizById(id);
      setQuiz(data);
    } catch (error) {
      toast.error("Failed to load quiz.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_index) {
        correct++;
      }
    });

    const percent = Math.round((correct / quiz.questions.length) * 100);
    setScoreData({ percentage: percent, correctCount: correct });
    setIsFinished(true);
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  const handleCompleteModule = async () => {
    if (!quiz.roadmap_id) {
        // Fallback just in case roadmap_id is missing
        navigate('/my-learning');
        return;
    }

    setIsCompleting(true);
    try {
        const response = await roadmapService.completeRoadmap(quiz.roadmap_id);
        
        if (response.xp_gained > 0) {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold text-purple-600">Course Completed!</span>
                    <span className="text-sm font-bold text-green-600">+{response.xp_gained} Bonus XP!</span>
                </div>, 
                { duration: 5000, icon: '🏆' }
            );
        } else {
            toast.success("Module Completed!");
        }
        
        navigate('/my-learning');
    } catch (error) {
        console.error(error);
        toast.error("Failed to mark course as completed, but your score is saved!");
        navigate('/my-learning'); // Still navigate away so they aren't stuck
    } finally {
        setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!quiz || !quiz.questions) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const hasSelectedCurrent = selectedAnswers[currentIndex] !== undefined;

  if (isFinished) {
    const isPassed = scoreData.percentage >= 90;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {isPassed && <Confetti recycle={false} numberOfPieces={300} />}
        
        <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 text-center animate-in zoom-in-95 duration-300">
          
          <div className="flex justify-center mb-6">
            {isPassed ? (
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                <Award className="w-12 h-12" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-inner">
                <XCircle className="w-12 h-12" />
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isPassed ? "Outstanding!" : "Not Quite There"}
          </h2>
          
          <p className="text-gray-500 mb-8">
            You scored <strong className={`text-xl ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {scoreData.percentage}%
            </strong> ({scoreData.correctCount} out of {quiz.questions.length})
          </p>

          {!isPassed && (
            <div className="bg-orange-50 border border-orange-100 text-orange-800 p-4 rounded-xl text-sm font-medium mb-8">
              A minimum score of 90% is required to pass this module. Review the material and try again!
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!isPassed ? (
              <button 
                onClick={handleRetake}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
            ) : (
              <button 
                onClick={handleCompleteModule}
                disabled={isCompleting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                {isCompleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <CheckCircle className="w-5 h-5" />
                )}
                {isCompleting ? "Saving..." : "Complete Module"}
                </button>
            )}
            
            <button 
              onClick={() => navigate(-1)}
              className="w-full text-gray-500 hover:bg-gray-100 font-bold py-4 rounded-xl transition-all"
            >
              Return to Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }


  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">{quiz.topic} Quiz</h1>
            <p className="text-sm text-gray-500 font-medium">Question {currentIndex + 1} of {quiz.questions.length}</p>
          </div>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`
                    w-full text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-between
                    ${isSelected 
                      ? 'border-purple-600 bg-purple-50 text-purple-900' 
                      : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <span className="text-lg">{option}</span>
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-purple-600' : 'border-gray-300'}
                  `}>
                    {isSelected && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!hasSelectedCurrent}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all
              ${hasSelectedCurrent 
                ? 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-lg shadow-gray-200' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            {currentIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
            {currentIndex !== quiz.questions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuizView;