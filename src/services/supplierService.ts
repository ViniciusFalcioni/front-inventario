// src/services/supplierService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/suppliers';

export const fetchSuppliers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.fornecedores;
    } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        throw error;
    }
};

export const addSupplier = async (supplierData: { nome: string; contato: string; endereco: string }) => {
    try {
        const response = await axios.post(API_URL, supplierData);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar fornecedor:', error);
        throw error;
    }
};

export const updateSupplier = async (supplierId: number, supplierData: { nome: string; contato: string; endereco: string }) => {
    try {
        const response = await axios.put(`${API_URL}/${supplierId}`, supplierData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        throw error;
    }
};

export const deleteSupplier = async (supplierId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar fornecedor:', error);
        throw error;
    }
};
