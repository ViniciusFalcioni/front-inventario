// src/services/productService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/products';

// Função para listar produtos com filtros e ordenação
export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.produtos;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

// Função para adicionar um novo produto
export const addProduct = async (productData: FormData) => {
    await axios.post(API_URL, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// Função para atualizar um produto
export const updateProduct = async (productId: number, productData: FormData) => {
    await axios.put(`${API_URL}/${productId}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// Função para deletar um produto
export const deleteProduct = async (productId: number) => {
    await axios.delete(`${API_URL}/${productId}`);
};
