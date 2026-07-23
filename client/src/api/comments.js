import api from './axios';

export const getCommentsRequest = (ticketId) => api.get(`/api/comments/${ticketId}`);
export const createCommentRequest = (ticketId, message) =>
  api.post('/api/comments', { ticketId, message });
