import { useState } from 'react';
import { TrendingUp, TrendingDown, IndianRupee, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { ExpenseChart } from '@/components/expense-chart';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types/transaction';

const Index = () => {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
  } = useTransactions();

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const summary = getSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your expense tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Take control of your finances with smart expense tracking
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <StatsCard
            title="Total Income"
            value={formatCurrency(summary.totalIncome)}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="income"
          />
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(summary.totalExpenses)}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="expense"
          />
          <StatsCard
            title="Net Income"
            value={formatCurrency(summary.netIncome)}
            icon={<IndianRupee className="h-6 w-6" />}
            variant={summary.netIncome >= 0 ? 'income' : 'expense'}
          />
          <StatsCard
            title="Total Transactions"
            value={summary.transactionCount.toString()}
            icon={<BarChart3 className="h-6 w-6" />}
            variant="neutral"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 animate-slide-up">
            <TransactionForm onSubmit={addTransaction} />
          </div>

          {/* Right Column - Chart and List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <ExpenseChart transactions={transactions} />
            </div>

            {/* Transaction List */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <TransactionList
                transactions={transactions}
                onEdit={setEditingTransaction}
                onDelete={deleteTransaction}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditTransactionDialog
        transaction={editingTransaction}
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={updateTransaction}
      />
    </div>
  );
};

export default Index;
