import React, { useState, useEffect } from 'react';
import { X, Target, Check } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatThaiMonth } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { budget, updateBudget, selectedMonth } = useTransactions();
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budget && budget.amount) {
      setAmount(String(budget.amount));
    } else {
      setAmount('');
    }
  }, [budget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return;

    try {
      setIsSubmitting(true);
      await updateBudget(val);
      onClose();
    } catch (err) {
      console.error('Update budget error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBudget = (val: number) => {
    setAmount(String(val));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ตั้งค่างบประมาณ
              </h3>
              <p className="text-xs text-slate-500">
                รอบเดือน {formatThaiMonth(selectedMonth)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              กำหนดงบใช้จ่ายสูงสุด (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="เช่น 25000"
                className="w-full pl-10 pr-4 py-2.5 text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[15000, 25000, 35000, 50000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleQuickBudget(v)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {v.toLocaleString()} ฿
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกงบประมาณ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
