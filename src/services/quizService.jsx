import api from '../api/axios';

const quizService = {
  generateQuiz: async (topic, difficulty) => {
    const response = await api.post('/quizzes/generate', { 
        topic: topic, 
        difficulty: difficulty 
    });
    return response.data;
  },
  // Fetch an existing quiz by its ID
  getQuizById: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },
  
  // Submit answers (for later)
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  }
};

export default quizService;