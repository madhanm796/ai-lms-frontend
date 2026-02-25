import api from '../api/axios';

const roadmapService = {

  // 1. Search existing roadmaps
  search: async (query) => {
    // GET /roadmaps?q=python
    const response = await api.get(`/roadmaps/search`, { params: { q: query } });
    return response.data; 
  },

  // 2. Generate new (Existing)
  generate: async (topic, level) => {
    const response = await api.post('/roadmaps/generate', { topic, level });
    return response.data;
  },

  getMyRoadmaps: async () => {
    const response = await api.get('/roadmaps/my-roadmaps');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/roadmaps/explore')
  },
  
  getRoadmapById: async (id) => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
  },

  completeRoadmap: async (roadmapId) => {
    const response = await api.patch(`/roadmaps/${roadmapId}/complete`);
    return response.data;
  },

 updateStepProgress: async (roadmapId, stepIndex) => {
    // Matches your Pydantic schema: class NodeProgress(BaseModel): step_id: int
    const response = await api.patch(`/roadmaps/${roadmapId}/progress`, {
      step_id: stepIndex 
    });
    return response.data;
  }
};

export default roadmapService;