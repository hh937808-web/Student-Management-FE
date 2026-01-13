import axiosClient from './axiosClient';

export const studentApi = {
  getPaging: (params) => axiosClient.get('/students/paging', { params }),
  search: (keyword) => axiosClient.get('/students/search', { params: { keyword } }),
  create: (data) => axiosClient.post('/students', data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  delete: (id) => axiosClient.delete(`/students/${id}`),
  changeStatus: (id, status) => axiosClient.patch(`/students/${id}/status`, null, { params: { status } })
};