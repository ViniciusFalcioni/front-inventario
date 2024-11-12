// src/services/clientService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/clients';

// Função para buscar clientes com filtros opcionais
export const fetchClients = async (filters = {}) => {
    try {
        const response = await axios.get(API_URL, { params: filters });
        return response.data.clientes;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }
};

// Função para buscar todos os clientes sem filtros (para uso no select do pedido)
export const fetchAllClients = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.clientes;
    } catch (error) {
        console.error('Erro ao buscar todos os clientes:', error);
        throw error;
    }
};

// Função para adicionar um novo cliente
export const addClient = async (clientData: { nome: string; cpf_cnpj: string; contato: string; endereco: string }) => {
    try {
        const response = await axios.post(API_URL, clientData);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        throw error;
    }
};

// Função para atualizar um cliente existente
export const updateClient = async (clientId: number, clientData: { nome: string; cpf_cnpj: string; contato: string; endereco: string }) => {
    try {
        const response = await axios.put(`${API_URL}/${clientId}`, clientData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};

// Função para deletar um cliente
export const deleteClient = async (clientId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${clientId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
    }
};

// Função para buscar o histórico de pedidos de um cliente específico, com filtro de status opcional
export const fetchClientOrders = async (clientId: number, status: string = '') => {
    try {
        const response = await axios.get(`${API_URL}/${clientId}/orders`, { params: { status } });
        return response.data.pedidos;
    } catch (error) {
        console.error('Erro ao buscar histórico de pedidos do cliente:', error);
        throw error;
    }
};
