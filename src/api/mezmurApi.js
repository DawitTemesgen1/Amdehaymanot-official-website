import api from './axiosConfig';

const syncHeaders = {
  headers: {
    'X-API-Key': 'default-secret-key-123'
  }
};

export const mezmurApi = {
  // Categories
  getCategories: () => api.get('/mezmur/categories', syncHeaders),
  createCategory: (data) => api.post('/mezmur/category', data),
  updateCategory: (id, data) => api.put(`/mezmur/category/${id}`, data),

  // Mezmurs
  getAllMezmurs: (page = 1, limit = 5000) => api.get(`/mezmur?page=${page}&limit=${limit}`),
  createMezmur: (data) => api.post('/mezmur', data),
  updateMezmur: (id, data) => api.put(`/mezmur/${id}`, data),
  deleteMezmur: (id) => api.delete(`/mezmur/${id}`),

  // Audio Upload
  uploadAudio: (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('audio', file);
    return api.post(`/mezmur/${id}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  uploadAudioTemp: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('audio', file);
    return api.post(`/mezmur/upload-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
};
