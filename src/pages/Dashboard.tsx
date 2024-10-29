// src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-600 text-white flex flex-col">
                <div className="p-4 text-center font-bold text-xl">
                    Dashboard
                </div>
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
                        <p className="mt-2 text-gray-600">50</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total de Fornecedores</h2>
                        <p className="mt-2 text-gray-600">20</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total de Pedidos</h2>
                        <p className="mt-2 text-gray-600">30</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
