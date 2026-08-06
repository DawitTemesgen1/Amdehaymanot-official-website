import api from './axiosConfig';

export const submissionApi = {
  getSubmissions: (status = 'pending', page = 1, limit = 50) => 
    api.get(`/submissions?status=${status}&page=${page}&limit=${limit}`),
    
  approveSubmission: (id, data) => 
    api.post(`/submissions/${id}/approve`, data),
    
  rejectSubmission: (id) => 
    api.post(`/submissions/${id}/reject`)
};
