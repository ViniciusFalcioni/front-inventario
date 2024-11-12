// src/pages/Products.tsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem?: string;
}

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState(0);
    const [quantidade, setQuantidade] = useState(0);
    const [imagem, setImagem] = useState<File | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filters, setFilters] = useState({ nome: '', orderBy: '' });
    const navigate = useNavigate();

    useEffect(() => {
        getProducts();
    }, [filters]);

    const getProducts = async () => {
        try {
            const produtos = await fetchProducts(filters);
            setProducts(produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImagem(e.target.files[0]);
        }
    };

    const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco.toString());
        formData.append('quantidade', quantidade.toString());
        if (imagem) formData.append('imagem', imagem);

        try {
            if (editingProduct) {
                // Atualizar Produto
                await updateProduct(editingProduct.id, formData);
                setEditingProduct(null);
            } else {
                // Adicionar Produto
                await addProduct(formData);
            }
            getProducts();
            resetForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao adicionar/atualizar produto:', error);
                console.error('Status:', error.response?.status);
                console.error('Detalhes do erro:', error.response?.data);
            } else {
                console.error('Erro inesperado:', error);
            }
        }
    };

    const handleEditProduct = (product: Product) => {
        setNome(product.nome);
        setDescricao(product.descricao);
        setPreco(product.preco);
        setQuantidade(product.quantidade);
        setImagem(null); // Limpa o campo de imagem, pois o arquivo não é exibido no input
        setEditingProduct(product);
    };

    const handleDeleteProduct = async (productId: number) => {
        try {
            await deleteProduct(productId);
            getProducts();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
        }
    };

    const resetForm = () => {
        setNome('');
        setDescricao('');
        setPreco(0);
        setQuantidade(0);
        setImagem(null);
        setEditingProduct(null);
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

            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Produtos</h1>

            {/* Formulário para Adicionar/Editar Produto */}
            <form onSubmit={handleAddOrUpdateProduct} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Preço</label>
                    <input
                        type="number"
                        placeholder="Preço"
                        value={preco}
                        onChange={(e) => setPreco(Number(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantidade</label>
                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Imagem</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
                    </button>
                    {editingProduct && (
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

            {/* Tabela de Produtos */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Nome</th>
                            <th className="py-3 px-6 text-left">Descrição</th>
                            <th className="py-3 px-6 text-left">Preço</th>
                            <th className="py-3 px-6 text-left">Quantidade</th>
                            <th className="py-3 px-6 text-left">Imagem</th>
                            <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{product.nome}</td>
                                <td className="py-3 px-6 text-left">{product.descricao}</td>
                                <td className="py-3 px-6 text-left">{product.preco}</td>
                                <td className="py-3 px-6 text-left">{product.quantidade}</td>
                                <td className="py-3 px-6 text-left">
                                    {product.imagem && (
                                        <img
                                            src={`http://localhost:3000/${product.imagem}`}
                                            alt={product.nome}
                                            className="w-16 h-16 object-cover"
                                        />
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded mx-1"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
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

export default Products;
