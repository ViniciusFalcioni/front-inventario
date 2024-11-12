// src/pages/Suppliers.tsx
import React, { useEffect, useState } from 'react';
import { fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../services/supplierService';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';

interface Supplier {
    id: number;
    nome: string;
    cnpj: string;
    contato: string;
    endereco: string;
}

function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [contato, setContato] = useState('');
    const [endereco, setEndereco] = useState('');
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getSuppliers();
    }, []);

    const getSuppliers = async () => {
        try {
            const fornecedores = await fetchSuppliers();
            setSuppliers(fornecedores);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
        }
    };

    const handleAddOrUpdateSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        const supplierData = { nome, cnpj, contato, endereco };

        try {
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, supplierData);
                setEditingSupplier(null);
            } else {
                await addSupplier(supplierData);
            }
            getSuppliers();
            resetForm();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                console.error('Erro ao adicionar/atualizar fornecedor:', error);
                setErrorMessage('Erro ao adicionar/atualizar fornecedor');
            }
        }
    };

    const handleEditSupplier = (supplier: Supplier) => {
        setNome(supplier.nome);
        setCnpj(supplier.cnpj);
        setContato(supplier.contato);
        setEndereco(supplier.endereco);
        setEditingSupplier(supplier);
        setErrorMessage(null); // Limpa a mensagem de erro ao editar
    };

    const handleDeleteSupplier = async (supplierId: number) => {
        try {
            await deleteSupplier(supplierId);
            getSuppliers();
        } catch (error) {
            console.error('Erro ao deletar fornecedor:', error);
        }
    };

    const resetForm = () => {
        setNome('');
        setCnpj('');
        setContato('');
        setEndereco('');
        setEditingSupplier(null);
        setErrorMessage(null); // Limpa a mensagem de erro ao resetar o formulário
    };

    return (
        <div className="p-8">
            {/* Botão de Voltar para o Dashboard */}
            <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Voltar ao Dashboard
            </button>

            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Fornecedores</h1>

            {/* Mensagem de Erro */}
            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Formulário para Adicionar/Editar Fornecedor */}
            <form onSubmit={handleAddOrUpdateSupplier} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingSupplier ? 'Editar Fornecedor' : 'Adicionar Fornecedor'}
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">CNPJ</label>
                    <InputMask
                        mask="99.999.999/9999-99"
                        placeholder="CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
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
                        onChange={(e) => setContato(e.target.value)}
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
                        onChange={(e) => setEndereco(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {editingSupplier ? 'Atualizar Fornecedor' : 'Adicionar Fornecedor'}
                    </button>
                    {editingSupplier && (
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

            {/* Tabela de Fornecedores */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Nome</th>
                            <th className="py-3 px-6 text-left">CNPJ</th>
                            <th className="py-3 px-6 text-left">Contato</th>
                            <th className="py-3 px-6 text-left">Endereço</th>
                            <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{supplier.nome}</td>
                                <td className="py-3 px-6 text-left">{supplier.cnpj}</td>
                                <td className="py-3 px-6 text-left">{supplier.contato}</td>
                                <td className="py-3 px-6 text-left">{supplier.endereco}</td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => handleEditSupplier(supplier)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded mx-1"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSupplier(supplier.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded mx-1"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Suppliers;
