import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/transactionService';

interface Transaction {
    id: number;
    data: string;
    tipo: string;
    valor: number;
    pedidoId?: number;
    produtoId?: number;
}

function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filterType, setFilterType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadTransactions();
    }, [filterType, startDate, endDate]);

    const loadTransactions = async () => {
        const filters = {
            tipo: filterType,
            dataInicio: startDate,
            dataFim: endDate,
        };
        const response = await fetchTransactions(filters);
        setTransactions(response);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Transações</h1>

            <div className="mb-4">
                <label className="mr-2">Tipo de Transação:</label>
                <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                    <option value="">Todos</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                </select>
            </div>

            <div className="mb-4">
                <label>Data Inicial:</label>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
            </div>

            <div className="mb-4">
                <label>Data Final:</label>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
            </div>

            <table className="w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Pedido ID</th>
                        <th>Produto ID</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.data}</td>
                            <td>{transaction.tipo}</td>
                            <td>R$ {transaction.valor.toFixed(2)}</td>
                            <td>{transaction.pedidoId || '-'}</td>
                            <td>{transaction.produtoId || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transactions;
