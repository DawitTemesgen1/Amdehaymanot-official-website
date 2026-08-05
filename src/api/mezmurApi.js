import api from './axiosConfig';

export const mezmurApi = {
  // Categories
  getCategories: () => api.get('/mezmur/categories'),
  createCategory: (data) => api.post('/mezmur/category', data),
  updateCategory: (id, data) => api.put(`/mezmur/category/${id}`, data),

  // Mezmurs
  // For the admin panel, we can use the sync endpoint with since_version=0 to get all mezmurs
  getAllMezmurs: () => api.get('/mezmur/sync?since_version=0'),
  createMezmur: (data) => api.post('/mezmur', data),
  updateMezmur: (id, data) => api.put(`/mezmur/${id}`, data),
  deleteMezmur: (id) => api.delete(`/mezmur/${id}`),

  // Audio Upload
  uploadAudio: (id, file) => {
    const formData = new FormData();
    formData.append('audio', file);
    return api.post(`/mezmur/${id}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
