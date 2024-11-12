// src/services/dashboardService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/dashboard';

export const fetchDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};
