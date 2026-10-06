import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import { Transaction, MonthlyStats, Budget } from '../types';
import { getCategoryMeta } from '../constants/categories';

interface TransactionContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  loading: boolean;
  error: string | null;
  monthlyStats: MonthlyStats;
  sixMonthsTrend: { month: string; income: number; expense: number; net: number }[];
  budget: Budget | null;
  addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (amount: number) => Promise<void>;
  seedSampleData: () => Promise<void>;
  exportCSV: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Initial fallback mock transactions for demo user
const generateSampleTransactions = (userId: string, targetMonth: string): Transaction[] => {
  return [
    {
      id: 'demo-1',
      userId,
      type: 'income',
      amount: 45000,
      category: 'เงินเดือนและค่าจ้าง',
      date: `${targetMonth}-01`,
      note: 'เงินเดือนประจำเดือน',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      userId,
      type: 'income',
      amount: 7500,
      category: 'งานเสริมและฟรีแลนซ์',
      date: `${targetMonth}-04`,
      note: 'รับงานออกแบบกราฟิก',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      userId,
      type: 'expense',
      amount: 8500,
      category: 'ที่อยู่อาศัยและค่าเช่า',
      date: `${targetMonth}-02`,
      note: 'ค่าเช่าคอนโด',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      userId,
      type: 'expense',
      amount: 1450,
      category: 'ค่าน้ำ-ไฟ-อินเทอร์เน็ต',
      date: `${targetMonth}-03`,
      note: 'ค่าไฟและเน็ตบ้าน',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      userId,
      type: 'expense',
      amount: 4200,
      category: 'อาหารและเครื่องดื่ม',
      date: `${targetMonth}-05`,
      note: 'ซื้อของสดเข้าตู้เย็น Makro',
      paymentMethod: 'credit_card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      userId,
      type: 'expense',
      amount: 1800,
      category: 'การเดินทางและน้ำมัน',
      date: `${targetMonth}-06`,
      note: 'เติมน้ำมันรถยนต์',
      paymentMethod: 'credit_card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-7',
      userId,
      type: 'expense',
      amount: 2500,
      category: 'ช้อปปิ้งและของใช้',
      date: `${targetMonth}-07`,
      note: 'เสื้อผ้าและของใช้ส่วนตัว',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-8',
      userId,
      type: 'expense',
      amount: 950,
      category: 'บันเทิงและท่องเที่ยว',
      date: `${targetMonth}-08`,
      note: 'ดูหนังและสตรีมมิ่ง',
      paymentMethod: 'credit_card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-9',
      userId,
      type: 'expense',
      amount: 5000,
      category: 'ออมเงินและประกัน',
      date: `${targetMonth}-09`,
      note: 'ฝากประจำ DCA กองทุน',
      paymentMethod: 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoUser } = useAuth();

  // Current month default in YYYY-MM
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Firestore listener
  useEffect(() => {
    if (user) {
      setLoading(true);
      const collectionPath = `users/${user.uid}/transactions`;
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: Transaction[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            items.push({
              id: docSnapshot.id,
              userId: data.userId || user.uid,
              type: data.type,
              amount: Number(data.amount) || 0,
              category: data.category || '',
              date: data.date || '',
              note: data.note || '',
              paymentMethod: data.paymentMethod || 'transfer',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            });
          });
          setRawTransactions(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Transactions listen error:', err);
          setError('ไม่สามารถเชื่อมต่อฐานข้อมูลได้');
          setLoading(false);
          handleFirestoreError(err, OperationType.GET, collectionPath);
        }
      );

      // Listen to Budget for selected month
      const budgetDocId = `${selectedMonth}_total`;
      const budgetDocPath = `users/${user.uid}/budgets/${budgetDocId}`;
      const unsubBudget = onSnapshot(
        doc(db, 'users', user.uid, 'budgets', budgetDocId),
        (docSnap) => {
          if (docSnap.exists()) {
            const bData = docSnap.data();
            setBudget({
              id: docSnap.id,
              userId: user.uid,
              month: bData.month,
              category: bData.category,
              amount: bData.amount,
            });
          } else {
            setBudget(null);
          }
        },
        (err) => {
          console.error('Budget listen error:', err);
          handleFirestoreError(err, OperationType.GET, budgetDocPath);
        }
      );

      return () => {
        unsubscribe();
        unsubBudget();
      };
    } else if (isDemoUser) {
      // Demo user fallback with mock data
      setRawTransactions(generateSampleTransactions('demo-user', selectedMonth));
      setBudget({
        id: 'demo-budget',
        userId: 'demo-user',
        month: selectedMonth,
        category: 'total',
        amount: 30000,
      });
      setLoading(false);
      setError(null);
    } else {
      setRawTransactions([]);
      setBudget(null);
      setLoading(false);
    }
  }, [user, isDemoUser, selectedMonth]);

  // Filter transactions for the selected month
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [rawTransactions, selectedMonth]);

  // Compute monthly statistics
  const monthlyStats = useMemo<MonthlyStats>(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<
      string,
      { amount: number; count: number; type: 'income' | 'expense' }
    > = {};

    // Grouping by day in the month
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const dailyMap: Record<number, { income: number; expense: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      dailyMap[d] = { income: 0, expense: 0 };
    }

    filteredTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }

      // Category breakdown
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { amount: 0, count: 0, type: t.type };
      }
      categoryMap[t.category].amount += amt;
      categoryMap[t.category].count += 1;

      // Daily trend
      const dayNum = parseInt(t.date.split('-')[2], 10);
      if (dayNum && dailyMap[dayNum]) {
        if (t.type === 'income') {
          dailyMap[dayNum].income += amt;
        } else {
          dailyMap[dayNum].expense += amt;
        }
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    const categoryBreakdown = Object.entries(categoryMap).map(([category, info]) => {
      const totalForType = info.type === 'income' ? totalIncome : totalExpense;
      const percentage = totalForType > 0 ? Math.round((info.amount / totalForType) * 100) : 0;
      const meta = getCategoryMeta(category, info.type);
      return {
        category,
        amount: info.amount,
        percentage,
        type: info.type,
        count: info.count,
        color: meta.color,
      };
    }).sort((a, b) => b.amount - a.amount);

    let cumulativeBalance = 0;
    const dailyTrend = Object.entries(dailyMap).map(([dayStr, vals]) => {
      const d = parseInt(dayStr, 10);
      cumulativeBalance += vals.income - vals.expense;
      return {
        day: d,
        date: `${selectedMonth}-${String(d).padStart(2, '0')}`,
        income: vals.income,
        expense: vals.expense,
        balance: cumulativeBalance,
      };
    });

    return {
      month: selectedMonth,
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      transactionCount: filteredTransactions.length,
      categoryBreakdown,
      dailyTrend,
    };
  }, [filteredTransactions, selectedMonth]);

  // 6 months trend calculation for historical bar charts
  const sixMonthsTrend = useMemo(() => {
    const [currY, currM] = selectedMonth.split('-').map(Number);
    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currY, currM - 1 - i, 1);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(mStr);
    }

    return months.map((m) => {
      const monthTx = rawTransactions.filter((t) => t.date.startsWith(m));
      const income = monthTx
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTx
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        month: m,
        income,
        expense,
        net: income - expense,
      };
    });
  }, [rawTransactions, selectedMonth]);

  // Actions
  const addTransaction = async (
    data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    const timestamp = new Date().toISOString();
    const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (user) {
      const docPath = `users/${user.uid}/transactions/${id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'transactions', id), {
          userId: user.uid,
          type: data.type,
          amount: Number(data.amount),
          category: data.category,
          date: data.date,
          note: data.note || '',
          paymentMethod: data.paymentMethod || 'transfer',
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    } else if (isDemoUser) {
      const newTx: Transaction = {
        id,
        userId: 'demo-user',
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setRawTransactions((prev) => [newTx, ...prev]);
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const timestamp = new Date().toISOString();
    if (user) {
      const docPath = `users/${user.uid}/transactions/${id}`;
      try {
        const updatePayload: Record<string, any> = {
          updatedAt: timestamp,
        };
        if (data.type !== undefined) updatePayload.type = data.type;
        if (data.amount !== undefined) updatePayload.amount = Number(data.amount);
        if (data.category !== undefined) updatePayload.category = data.category;
        if (data.date !== undefined) updatePayload.date = data.date;
        if (data.note !== undefined) updatePayload.note = data.note;
        if (data.paymentMethod !== undefined) updatePayload.paymentMethod = data.paymentMethod;

        await updateDoc(doc(db, 'users', user.uid, 'transactions', id), updatePayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      }
    } else if (isDemoUser) {
      setRawTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: timestamp } : t))
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    if (user) {
      const docPath = `users/${user.uid}/transactions/${id}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    } else if (isDemoUser) {
      setRawTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const updateBudget = async (amount: number) => {
    const budgetDocId = `${selectedMonth}_total`;
    const timestamp = new Date().toISOString();
    if (user) {
      const docPath = `users/${user.uid}/budgets/${budgetDocId}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'budgets', budgetDocId), {
          userId: user.uid,
          month: selectedMonth,
          category: 'total',
          amount: Number(amount),
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    } else if (isDemoUser) {
      setBudget({
        id: budgetDocId,
        userId: 'demo-user',
        month: selectedMonth,
        category: 'total',
        amount: Number(amount),
        updatedAt: timestamp,
      });
    }
  };

  const seedSampleData = async () => {
    if (!user) return;
    const samples = generateSampleTransactions(user.uid, selectedMonth);
    for (const item of samples) {
      const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const docPath = `users/${user.uid}/transactions/${id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'transactions', id), {
          userId: user.uid,
          type: item.type,
          amount: item.amount,
          category: item.category,
          date: item.date,
          note: item.note,
          paymentMethod: item.paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    }
    // Also seed a budget
    await updateBudget(28000);
  };

  const exportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน (บาท)', 'วิธีชำระ', 'หมายเหตุ'];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      `"${t.category}"`,
      t.amount,
      t.paymentMethod || '-',
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Income_Expense_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: rawTransactions,
        filteredTransactions,
        selectedMonth,
        setSelectedMonth,
        loading,
        error,
        monthlyStats,
        sixMonthsTrend,
        budget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        seedSampleData,
        exportCSV,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
