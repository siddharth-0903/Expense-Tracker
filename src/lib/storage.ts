import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'expense-tracker-transactions';

export const storage = {
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.unshift(transaction); // Add to beginning for recent-first ordering
    storage.saveTransactions(transactions);
  },

  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>): void => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      storage.saveTransactions(transactions);
    }
  },

  deleteTransaction: (id: string): void => {
    const transactions = storage.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    storage.saveTransactions(filtered);
  },

  exportTransactions: (): string => {
    const transactions = storage.getTransactions();
    return JSON.stringify(transactions, null, 2);
  },

  importTransactions: (data: string): boolean => {
    try {
      const imported = JSON.parse(data) as Transaction[];
      if (Array.isArray(imported)) {
        storage.saveTransactions(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};