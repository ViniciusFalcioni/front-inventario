// src/Register.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/auth/register', {
                nome,
                email,
                senha,
                tipo_usuario: 'Usuario'
            });

            setMessage('Cadastro realizado com sucesso! Redirecionando para login...');

            // Redireciona para a página de login após o cadastro
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                setMessage('Erro ao cadastrar: ' + error.response.data.message);
            } else {
                setMessage('Erro ao cadastrar.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Cadastrar
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
                <p className="mt-4 text-center">
                    Já tem uma conta? <a href="/" className="text-indigo-600 hover:underline">Faça login</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
