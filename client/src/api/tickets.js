import api from './axios';

export const getTicketsRequest = () => api.get('/api/tickets');
export const getTicketByIdRequest = (id) => api.get(`/api/tickets/${id}`);

export const createTicketRequest = (formData) =>
  api.post('/api/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addAttachmentsRequest = (id, formData) =>
  api.post(`/api/tickets/${id}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const assignTicketRequest = (id, technicianId) =>
  api.patch(`/api/tickets/${id}/assign`, { technicianId });

export const updateTicketStatusRequest = (id, status) =>
  api.patch(`/api/tickets/${id}/status`, { status });
