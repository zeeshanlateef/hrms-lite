import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = () => api.get('/employees/');
export const addEmployee = (employeeData) => api.post('/employees/', employeeData);
export const updateEmployee = (id, employeeData) => api.put(`/employees/${id}`, employeeData);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export const getAttendance = (date) => {
  const params = date ? { date } : {};
  return api.get('/attendance/', { params });
};
export const markAttendance = (attendanceData) => api.post('/attendance/', attendanceData);

export const downloadEmployeesCSV = () => api.get('/employees/export/csv', { responseType: 'blob' });

export const getDashboardStats = (date) => api.get('/dashboard/stats', { params: { date } });

export default api;
