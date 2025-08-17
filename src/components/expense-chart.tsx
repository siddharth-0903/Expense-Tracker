import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/transaction';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expenseData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = [
    'hsl(200, 100%, 45%)',
    'hsl(142, 71%, 45%)',
    'hsl(0, 84%, 60%)',
    'hsl(38, 92%, 50%)',
    'hsl(270, 95%, 75%)',
    'hsl(180, 100%, 50%)',
    'hsl(320, 65%, 52%)',
    'hsl(25, 95%, 53%)',
    'hsl(60, 100%, 50%)',
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Expense Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of your expenses by category.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No expense data available</p>
          <p className="text-sm text-muted-foreground">Add some expenses to see the distribution chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Expense Distribution
        </CardTitle>
        <CardDescription>
          Breakdown of your expenses by category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};