// src/pages/CreateOrder.tsx
import React, { useEffect, useState } from 'react';
import { fetchClients } from '../services/clientService';
import { fetchProducts } from '../services/productService';
import { addOrder, fetchOrders } from '../services/orderService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Client {
    id: number;
    nome: string;
}

interface Product {
    id: number;
    nome: string;
    preco: number;
}

interface OrderItem {
    produtoId: number;
    quantidade: number;
    preco_unitario: number;
}

interface Order {
    id: number;
    clienteId: number;
    data: string;
    status: string;
    total: number;
}

function Orders() {
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number>(0);
    const [orderDate, setOrderDate] = useState('');
    const [orderStatus, setOrderStatus] = useState('Pendente');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();



    useEffect(() => {
        // Carregar clientes e produtos ao montar o componente
        const loadClients = async () => {
            const response = await fetchClients();
            setClients(response);
        };

        const loadProducts = async () => {
            const response = await fetchProducts();
            setProducts(response);
        };

        const loadOrders = async () => {
            const response = await fetchOrders();
            setOrders(response);
        };

        loadClients();
        loadProducts();
        loadOrders();
    }, []);

    const handleAddItem = (produtoId: number, preco: number) => {
        const newItem = {
            produtoId,
            quantidade: 1,
            preco_unitario: preco,
        };
        setOrderItems([...orderItems, newItem]);
        setTotal(total + preco);
    };

    const handleQuantityChange = (index: number, quantity: number) => {
        const newItems = [...orderItems];
        const item = newItems[index];
        const newTotal = total - item.quantidade * item.preco_unitario + quantity * item.preco_unitario;
        item.quantidade = quantity;
        setOrderItems(newItems);
        setTotal(newTotal);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verifica se o cliente foi selecionado antes de prosseguir
        if (selectedClientId === null) {
            alert('Selecione um cliente antes de criar o pedido');
            return;
        }

        // Estrutura dos dados do pedido
        const orderData = {
            clienteId: selectedClientId, // Garantido que não é null
            data: orderDate,
            status: orderStatus,
            valor_total: total,
            itens: orderItems,
        };

        console.log("Dados do Pedido:", orderData); // Verifica os dados antes de enviar

        try {
            // Envia o pedido ao backend
            await addOrder(orderData);
            alert('Pedido criado com sucesso!');
            resetForm(); // Reseta o formulário após sucesso
        } catch (error: unknown) {
            // Tratamento detalhado do erro
            if (axios.isAxiosError(error) && error.response) {
                console.error('Erro no backend:', error.response.data); // Exibe erro completo no console
                alert(`Erro no backend: ${JSON.stringify(error.response.data)}`); // Alerta com detalhes do erro
            } else {
                console.error('Erro inesperado:', error);
                alert('Erro inesperado ao criar o pedido.');
            }
        }
    };

    // Função para redefinir o formulário após criação do pedido
    const resetForm = () => {
        setSelectedClientId(null);
        setOrderDate('');
        setOrderStatus('Pendente');
        setOrderItems([]);
        setTotal(0);
    };


    return (
        <div className="p-8">
            <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Voltar ao Dashboard
            </button>

            <h2 className="text-3xl font-bold mb-6">Criar Pedido</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Cliente</label>
                    <select
                        value={selectedClientId || ''}
                        onChange={(e) => setSelectedClientId(Number(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Selecione o Cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Data do Pedido</label>
                    <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status do Pedido</label>
                    <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Concluído">Concluído</option>
                    </select>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Adicionar Itens ao Pedido</h3>
                    {products.map((product) => (
                        <div key={product.id} className="flex justify-between items-center border-b py-2">
                            <span>{product.nome}</span>
                            <span>R$ {product.preco.toFixed(2)}</span>
                            <button
                                type="button"
                                onClick={() => handleAddItem(product.id, product.preco)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                            >
                                Adicionar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Itens do Pedido</h3>
                    {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b py-2">
                            <span>Produto ID: {item.produtoId}</span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantidade}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                className="w-16 text-center border rounded"
                            />
                            <span>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Total: R$ {total.toFixed(2)}</h3>
                </div>

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Criar Pedido
                </button>
            </form>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Pedidos Criados</h2>
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Cliente</th>
                            <th className="border px-4 py-2">Data</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="border px-4 py-2">{order.id}</td>
                                <td className="border px-4 py-2">{order.clienteId}</td>
                                <td className="border px-4 py-2">{order.data}</td>
                                <td className="border px-4 py-2">{order.status}</td>
                                <td className="border px-4 py-2">R$ {order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
