import api from './axios';

export const getUsersRequest = () => api.get('/api/users');
export const getUserByIdRequest = (id) => api.get(`/api/users/${id}`);
export const createUserRequest = (data) => api.post('/api/users', data);
export const updateUserRequest = (id, data) => api.patch(`/api/users/${id}`, data);
export const deleteUserRequest = (id) => api.delete(`/api/users/${id}`);
