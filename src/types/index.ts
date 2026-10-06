export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'transfer' | 'credit_card' | 'other';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  paymentMethod?: PaymentMethod;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id?: string;
  userId: string;
  month: string; // YYYY-MM
  category: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface MonthlyStats {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    type: TransactionType;
    count: number;
    color: string;
  }[];
  dailyTrend: {
    day: number;
    date: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}
