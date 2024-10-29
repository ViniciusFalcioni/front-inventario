// src/pages/Products.tsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import axios from 'axios';

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

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco.toString());
        formData.append('quantidade', quantidade.toString());
        if (imagem) formData.append('imagem', imagem);

        try {
            await addProduct(formData);
            getProducts();
            resetForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao adicionar produto:', error);
                console.error('Status:', error.response?.status);
                console.error('Detalhes do erro:', error.response?.data); // Exibe a resposta completa do servidor
            } else {
                console.error('Erro inesperado:', error);
            }
        }
    };



    const handleUpdateProduct = async (product: Product) => {
        const formData = new FormData();
        formData.append('nome', product.nome);
        formData.append('descricao', product.descricao);
        formData.append('preco', product.preco.toString());
        formData.append('quantidade', product.quantidade.toString());
        if (imagem) formData.append('imagem', imagem);

        try {
            await updateProduct(product.id, formData);
            getProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
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
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Produtos</h1>

            {/* Formulário para Adicionar Produto */}
            <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Adicionar Produto</h2>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    name="preco"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    name="quantidade"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="file"
                    name="imagem"
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="bg-indigo-600 text-white p-2 rounded">
                    Adicionar Produto
                </button>
            </form>

            {/* Tabela de Produtos */}
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="border p-2">Nome</th>
                        <th className="border p-2">Descrição</th>
                        <th className="border p-2">Preço</th>
                        <th className="border p-2">Quantidade</th>
                        <th className="border p-2">Imagem</th>
                        <th className="border p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="border p-2">{product.nome}</td>
                            <td className="border p-2">{product.descricao}</td>
                            <td className="border p-2">{product.preco}</td>
                            <td className="border p-2">{product.quantidade}</td>
                            <td className="border p-2">
                                {product.imagem && (
                                    <img
                                        src={`http://localhost:3000/${product.imagem}`}
                                        alt={product.nome}
                                        className="w-16 h-16 object-cover"
                                    />
                                )}
                            </td>
                            <td className="border p-2 space-x-2">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="bg-yellow-500 text-white p-1 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;
