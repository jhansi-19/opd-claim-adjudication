import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const uploadClaim = async (formData) => {
  try {
    const response = await apiClient.post('/claims/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllClaims = async () => {
  try {
    const response = await apiClient.get('/claims');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getClaimById = async (id) => {
  try {
    const response = await apiClient.get(`/claims/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteClaim = async (id) => {
  try {
    const response = await apiClient.delete(`/claims/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStatistics = async () => {
  try {
    const response = await apiClient.get('/claims/statistics/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default apiClient;
