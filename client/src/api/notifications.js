import api from './axios';

export const getMyNotificationsRequest = () => api.get('/api/notifications');
export const markNotificationAsReadRequest = (id) => api.patch(`/api/notifications/${id}/read`);
