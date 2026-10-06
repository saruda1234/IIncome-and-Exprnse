/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  TransactionProvider,
  useTransactions,
} from './context/TransactionContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { MonthPicker } from './components/MonthPicker';
import { SummaryCards } from './components/SummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { Transaction } from './types';
import { AlertCircle, LogIn, Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, isDemoUser, loginWithGoogle } = useAuth();
  const { seedSampleData, filteredTransactions } = useTransactions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (item: Transaction) => {
    setEditingTransaction(item);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner if in Demo Mode */}
        {isDemoUser && !user && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-900 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>โหมดทดลองใช้งาน (Demo Preview):</strong> ข้อมูลนี้เป็นข้อมูลตัวอย่าง
                เข้าสู่ระบบด้วย Gmail เพื่อบันทึกข้อมูลของคุณลง Firebase แบบเรียลไทม์
              </span>
            </div>
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              เข้าสู่ระบบด้วย Gmail
            </button>
          </div>
        )}

        {/* First time prompt if user has 0 transactions */}
        {user && filteredTransactions.length === 0 && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-emerald-900">
              <p className="font-bold">ยินดีต้อนรับสู่ Income and Expense!</p>
              <p className="text-emerald-700 text-xs">
                คุณสามารถเพิ่มรายการรายรับ-รายจ่ายของคุณ หรือกดปุ่ม &quot;สร้างข้อมูลตัวอย่าง&quot; เพื่อทดลองดูกราฟและผลสรุป
              </p>
            </div>
            <button
              onClick={seedSampleData}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              สร้างข้อมูลตัวอย่าง 1 คลิก
            </button>
          </div>
        )}

        {/* Month Selector Bar */}
        <MonthPicker />

        {/* 4 Summary Cards (Net Balance, Income, Expense, Budget) */}
        <SummaryCards onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

        {/* Interactive Analytics Charts (Donut, 6-Month Trend Bars, Daily Flow) */}
        <AnalyticsCharts />

        {/* Transaction History & Records (Search, Filter, Edit, Delete, Export CSV) */}
        <TransactionList
          onOpenAddModal={handleOpenAddModal}
          onEditTransaction={handleEditTransaction}
        />
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        editItem={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-400 py-6 border-t border-slate-200">
        <p>Income and Expense &bull; บันทึกรายรับรายจ่าย สรุปผลรายเดือน และกราฟวิเคราะห์ข้อมูล</p>
        <p className="mt-1 text-[11px] text-slate-400">
          จัดเก็บข้อมูลบน Firebase Cloud Database พร้อมระบบเข้าสู่ระบบด้วย Gmail
        </p>
      </footer>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user, isDemoUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500">กำลังเชื่อมต่อ Firebase...</p>
      </div>
    );
  }

  if (!user && !isDemoUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
        <Navbar onOpenAddModal={() => {}} />
        <LandingHero />
        <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
          Income and Expense &bull; ระบบจัดการรายรับรายจ่าย ปลอดภัยบน Firebase
        </footer>
      </div>
    );
  }

  return (
    <TransactionProvider>
      <DashboardContent />
    </TransactionProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
