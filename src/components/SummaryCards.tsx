import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  AlertCircle,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface SummaryCardsProps {
  onOpenBudgetModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ onOpenBudgetModal }) => {
  const { monthlyStats, budget } = useTransactions();
  const { totalIncome, totalExpense, netBalance, savingsRate, transactionCount } =
    monthlyStats;

  // Budget calculations
  const budgetAmount = budget?.amount || 0;
  const budgetUsagePercent =
    budgetAmount > 0 ? Math.min(Math.round((totalExpense / budgetAmount) * 100), 100) : 0;
  const budgetRemaining = budgetAmount > 0 ? budgetAmount - totalExpense : 0;
  const isBudgetExceeded = budgetAmount > 0 && totalExpense > budgetAmount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Balance */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm border border-slate-700/60 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            ยอดคงเหลือสุทธิ
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              netBalance >= 0
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(netBalance)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>อัตราการออม:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                savingsRate >= 20
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : savingsRate >= 0
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            รายรับรวม
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
            +{formatCurrency(totalIncome)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            จากทั้งหมด{' '}
            <span className="font-semibold text-slate-700">
              {monthlyStats.categoryBreakdown.filter((c) => c.type === 'income').length}
            </span>{' '}
            หมวดหมู่
          </p>
        </div>
      </div>

      {/* 3. Total Expense */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            รายจ่ายรวม
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
            -{formatCurrency(totalExpense)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            บันทึกแล้ว{' '}
            <span className="font-semibold text-slate-700">
              {transactionCount}
            </span>{' '}
            รายการในเดือนนี้
          </p>
        </div>
      </div>

      {/* 4. Budget Tracker Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              งบประมาณเดือนนี้
            </span>
            <button
              onClick={onOpenBudgetModal}
              title="แก้ไขงบประมาณ"
              className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              budgetAmount === 0
                ? 'bg-slate-100 text-slate-400'
                : isBudgetExceeded
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-teal-50 text-teal-600 border border-teal-200'
            }`}
          >
            <Target className="w-5 h-5" />
          </div>
        </div>

        {budgetAmount > 0 ? (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-700">
                ใช้ไป {formatCurrency(totalExpense)}
              </span>
              <span className="text-xs font-medium text-slate-400">
                เป้าหมาย {formatNumber(budgetAmount)} ฿
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isBudgetExceeded
                    ? 'bg-rose-500'
                    : budgetUsagePercent > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {isBudgetExceeded ? (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline" /> เกินงบ{' '}
                    {formatCurrency(totalExpense - budgetAmount)}
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" /> คุมงบได้ดี
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-700">
                {isBudgetExceeded
                  ? `${Math.round((totalExpense / budgetAmount) * 100)}%`
                  : `เหลือ ${formatCurrency(budgetRemaining)}`}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 mb-2">
              ยังไม่ได้กำหนดงบประมาณสำหรับเดือนนี้
            </p>
            <button
              onClick={onOpenBudgetModal}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              + ตั้งค่างบประมาณ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
