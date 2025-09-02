export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: number;
}

export type TransactionCategory = {
  income: string[];
  expense: string[];
};

export const TRANSACTION_CATEGORIES: TransactionCategory = {
  income: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other Income'
  ],
  expense: [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other Expense'
  ]
};