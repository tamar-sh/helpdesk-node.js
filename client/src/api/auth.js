import api from './axios';

export const registerRequest = (data) => api.post('/api/auth/register', data);
export const loginRequest = (data) => api.post('/api/auth/login', data);
