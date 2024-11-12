// src/pages/Clients.tsx
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { fetchClients, addClient, updateClient, deleteClient, fetchClientOrders } from '../services/clientService';

interface Client {
    id: number;
    nome: string;
    cpf_cnpj: string;
    contato: string;
    endereco: string;
}

interface Order {
    id: number;
    data: string;
    status: string;
    valor_total: number;
}

function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [nome, setNome] = useState('');
    const [cpf_cnpj, setCpfCnpj] = useState('');
    const [contato, setContato] = useState('');
    const [endereco, setEndereco] = useState('');
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filterName, setFilterName] = useState('');
    const [filterCpfCnpj, setFilterCpfCnpj] = useState('');
    const [clientOrders, setClientOrders] = useState<Order[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    useEffect(() => {
        loadClients();
    }, [filterName, filterCpfCnpj]);

    const loadClients = async () => {
        const filters = {
            nome: filterName,
            cpf_cnpj: filterCpfCnpj,
        };
        try {
            const fetchedClients = await fetchClients(filters);
            setClients(fetchedClients);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const handleAddOrUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        const clientData = { nome, cpf_cnpj, contato, endereco };

        try {
            if (editingClient) {
                await updateClient(editingClient.id, clientData);
                setEditingClient(null);
            } else {
                await addClient(clientData);
            }
            loadClients();
            resetForm();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Erro ao adicionar/atualizar cliente');
            }
        }
    };

    const handleEditClient = (client: Client) => {
        setNome(client.nome);
        setCpfCnpj(client.cpf_cnpj);
        setContato(client.contato);
        setEndereco(client.endereco);
        setEditingClient(client);
        setErrorMessage(null);
    };

    const handleDeleteClient = async (clientId: number) => {
        try {
            await deleteClient(clientId);
            loadClients();
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
        }
    };

    const resetForm = () => {
        setNome('');
        setCpfCnpj('');
        setContato('');
        setEndereco('');
        setEditingClient(null);
        setErrorMessage(null);
    };

    const loadClientOrders = async (clientId: number) => {
        try {
            setSelectedClientId(clientId);
            const orders = await fetchClientOrders(clientId, '');
            setClientOrders(orders);
        } catch (error) {
            console.error('Erro ao carregar histórico de pedidos:', error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Clientes</h1>

            {/* Mensagem de Erro */}
            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>
            )}

            {/* Formulário de Adicionar/Editar Cliente */}
            <form onSubmit={handleAddOrUpdateClient} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingClient ? 'Editar Cliente' : 'Adicionar Cliente'}
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">CPF/CNPJ</label>
                    <InputMask
                        mask="999.999.999-99" // Ajuste a máscara conforme o necessário
                        placeholder="CPF/CNPJ"
                        value={cpf_cnpj}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpfCnpj(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contato</label>
                    <input
                        type="text"
                        placeholder="Contato"
                        value={contato}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContato(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Endereço</label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={endereco}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndereco(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {editingClient ? 'Atualizar Cliente' : 'Adicionar Cliente'}
                    </button>
                    {editingClient && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Filtros */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Filtrar por Nome"
                    value={filterName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <InputMask
                    mask="999.999.999-99"
                    placeholder="Filtrar por CPF/CNPJ"
                    value={filterCpfCnpj}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterCpfCnpj(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {/* Lista de Clientes */}
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">CPF/CNPJ</th>
                        <th className="py-3 px-6 text-left">Contato</th>
                        <th className="py-3 px-6 text-left">Endereço</th>
                        <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                    {clients.map((client) => (
                        <tr key={client.id} className="border-b border-gray-300 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{client.nome}</td>
                            <td className="py-3 px-6 text-left">{client.cpf_cnpj}</td>
                            <td className="py-3 px-6 text-left">{client.contato}</td>
                            <td className="py-3 px-6 text-left">{client.endereco}</td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    onClick={() => handleEditClient(client)}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded mx-1"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteClient(client.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded mx-1"
                                >
                                    Excluir
                                </button>
                                <button
                                    onClick={() => loadClientOrders(client.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded mx-1"
                                >
                                    Histórico
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Histórico de Pedidos */}
            {selectedClientId && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Histórico de Pedidos do Cliente #{selectedClientId}</h2>
                    {clientOrders.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">ID do Pedido</th>
                                    <th className="py-3 px-6 text-left">Data</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-left">Valor Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                                {clientOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-300 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{order.id}</td>
                                        <td className="py-3 px-6 text-left">{order.data}</td>
                                        <td className="py-3 px-6 text-left">{order.status}</td>
                                        <td className="py-3 px-6 text-left">{order.valor_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-600">Nenhum pedido encontrado.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Clients;
