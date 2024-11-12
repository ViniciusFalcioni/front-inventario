import axios from 'axios';

const API_URL = 'http://localhost:3000/transactions';

export const fetchTransactions = async (filters = {}) => {
    const response = await axios.get(API_URL, { params: filters });
    return response.data.transacoes;
};
