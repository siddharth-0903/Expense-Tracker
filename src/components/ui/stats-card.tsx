import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'neutral';
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  variant = 'default',
  className 
}: StatsCardProps) => {
  const variants = {
    default: 'gradient-primary text-white',
    income: 'gradient-income text-white',
    expense: 'gradient-expense text-white',
    neutral: 'gradient-card text-card-foreground border border-border',
  };

  return (
    <Card className={cn(
      'relative overflow-hidden shadow-medium transition-smooth hover:shadow-strong hover:scale-[1.02]',
      variants[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === 'neutral' ? 'text-muted-foreground' : 'text-white/80'
            )}>
              {title}
            </p>
            <p className={cn(
              "text-2xl font-bold tracking-tight",
              variant === 'neutral' ? 'text-foreground' : 'text-white'
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === 'neutral' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-white/20 text-white'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};