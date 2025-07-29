import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur de requête Axios pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajoute le token aux en-têtes
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonctions API existantes (elles utiliseront maintenant l'intercepteur)
export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

export const createConsultation = (consultationData) => api.post('/consultations', consultationData);
export const getConsultationsByPatientId = (patientId) => api.get(`/consultations/${patientId}`);

export const getAlertsByPatientId = (patientId) => api.get(`/alerts/${patientId}`);

export const generatePdf = (patientId) => api.get(`/pdf/${patientId}`, { responseType: 'blob' });

// Nouvelles fonctions API pour l'authentification
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
