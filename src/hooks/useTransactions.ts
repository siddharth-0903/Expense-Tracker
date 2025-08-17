import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionSummary } from '@/types/transaction';
import { storage } from '@/lib/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      const saved = storage.getTransactions();
      setTransactions(saved);
      setLoading(false);
    };

    loadTransactions();
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    storage.addTransaction(newTransaction);
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    storage.updateTransaction(id, updates);
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    storage.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const getSummary = useCallback((): TransactionSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const getFilteredTransactions = useCallback((
    type?: 'income' | 'expense',
    category?: string,
    searchTerm?: string
  ) => {
    return transactions.filter(transaction => {
      if (type && transaction.type !== type) return false;
      if (category && transaction.category !== category) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(search) ||
          transaction.category.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    getFilteredTransactions,
  };
};