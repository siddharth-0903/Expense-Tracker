import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction, TRANSACTION_CATEGORIES } from '@/types/transaction';

export default function ExpenseTracker() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expense-tracker-transactions', []);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculations
  const calculations = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (filterCategory === 'all') return transactions;
    return transactions.filter(t => t.category === filterCategory);
  }, [transactions, filterCategory]);

  // All categories for filter
  const allCategories = [...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: formData.type,
      amount,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      createdAt: Date.now()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Transaction Added",
      description: `${formData.type === 'income' ? 'Income' : 'Expense'} of ₹${amount.toFixed(2)} added successfully.`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your finances with ease and stay on top of your budget
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-income">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-income" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatCurrency(calculations.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-expense">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(calculations.totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                calculations.netIncome >= 0 ? 'text-income' : 'text-expense'
              }`}>
                {formatCurrency(calculations.netIncome)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Transaction Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'income' | 'expense') => 
                        setFormData(prev => ({ ...prev, type: value, category: '' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter transaction description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_CATEGORIES[formData.type].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                  Add Transaction
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Transaction List */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found. Add your first transaction to get started.
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{transaction.description}</span>
                          <Badge 
                            variant="outline" 
                            className={transaction.type === 'income' ? 'border-income-border text-income' : 'border-expense-border text-expense'}
                          >
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${
                          transaction.type === 'income' ? 'text-income' : 'text-expense'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="h-8 w-8 text-expense hover:bg-expense-light"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}