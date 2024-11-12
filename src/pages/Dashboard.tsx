// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../services/dashboardService';

function Dashboard() {
    const [stats, setStats] = useState({ totalProducts: 0, totalSuppliers: 0, totalOrders: 0 });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Erro ao carregar estatísticas do dashboard:', error);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-600 text-white flex flex-col">
                <div className="p-4 text-center font-bold text-xl">Dashboard</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Home
                    </Link>
                    <Link to="/products" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Produtos
                    </Link>
                    <Link to="/suppliers" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Fornecedores
                    </Link>
                    <Link to="/clients" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Clientes
                    </Link>
                    <Link to="/orders" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Pedidos
                    </Link>
                    <Link to="/transactions" className="block p-2 bg-indigo-700 rounded hover:bg-indigo-500 transition">
                        Transações
                    </Link>
                </nav>
                <div className="p-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                        className="w-full bg-red-500 p-2 rounded hover:bg-red-400 transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total de Produtos</h2>
                        <p className="mt-2 text-gray-600">{stats.totalProducts}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total de Fornecedores</h2>
                        <p className="mt-2 text-gray-600">{stats.totalSuppliers}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total de Pedidos</h2>
                        <p className="mt-2 text-gray-600">{stats.totalOrders}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
