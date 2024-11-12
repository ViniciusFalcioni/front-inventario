// src/services/orderService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/orders';

export const fetchOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data.pedidos;
};

export const addOrder = async (orderData: {
    clienteId: number;
    data: string;
    status: string;
    valor_total: number;
    itens: Array<{ produtoId: number; quantidade: number; preco_unitario: number }>;
}) => {
    const response = await axios.post(API_URL, orderData);
    return response.data;
};

export const updateOrder = async (
    orderId: number,
    orderData: {
        clienteId: number;
        data: string;
        status: string;
        valor_total: number;
        itens: Array<{ produtoId: number; quantidade: number; preco_unitario: number }>;
    }
) => {
    const response = await axios.put(`${API_URL}/${orderId}`, orderData);
    return response.data;
};

export const deleteOrder = async (orderId: number) => {
    const response = await axios.delete(`${API_URL}/${orderId}`);
    return response.data;
};

export const fetchOrderDetails = async (orderId: number) => {
    const response = await axios.get(`${API_URL}/${orderId}/details`);
    return response.data.itens;
};
