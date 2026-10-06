import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Calendar,
  CreditCard,
  FileText,
  DollarSign,
  Check,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryMeta,
} from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editItem,
}) => {
  const { addTransaction, updateTransaction, selectedMonth } = useTransactions();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize form when modal opens or editItem changes
  useEffect(() => {
    if (editItem) {
      setType(editItem.type);
      setAmount(String(editItem.amount));
      setCategory(editItem.category);
      setDate(editItem.date);
      setNote(editItem.note || '');
      setPaymentMethod(editItem.paymentMethod || 'transfer');
    } else {
      // Default new item
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]?.name || '');

      // Set today's date or matching month
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (todayStr.startsWith(selectedMonth)) {
        setDate(todayStr);
      } else {
        setDate(`${selectedMonth}-01`);
      }

      setNote('');
      setPaymentMethod('transfer');
    }
    setErrorMsg(null);
  }, [editItem, isOpen, selectedMonth]);

  // Switch default category when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory(EXPENSE_CATEGORIES[0]?.name || '');
    } else {
      setCategory(INCOME_CATEGORIES[0]?.name || '');
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + addValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('กรุณากรอกจำนวนเงินที่ถูกต้อง (มากกว่า 0)');
      return;
    }
    if (!category.trim()) {
      setErrorMsg('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!date) {
      setErrorMsg('กรุณาระบุวันที่');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      if (editItem) {
        await updateTransaction(editItem.id, {
          type,
          amount: numAmount,
          category,
          date,
          note,
          paymentMethod,
        });
      } else {
        await addTransaction({
          type,
          amount: numAmount,
          category,
          date,
          note,
          paymentMethod,
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Save transaction error:', err);
      setErrorMsg('บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                editItem
                  ? 'bg-blue-100 text-blue-600'
                  : type === 'expense'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {editItem ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editItem ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
              </h3>
              <p className="text-xs text-slate-500">
                ระบุรายละเอียดรายรับหรือรายจ่าย
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

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายจ่าย (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายรับ (Income)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              จำนวนเงิน (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 text-2xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Quick amount shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              เลือกหมวดหมู่
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      <CategoryIcon iconName={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันที่
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                วิธีชำระเงิน
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="transfer">โอนเงิน (Mobile Banking)</option>
                <option value="cash">เงินสด (Cash)</option>
                <option value="credit_card">บัตรเครดิต (Credit Card)</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              บันทึกข้อความ / หมายเหตุ (ถ้ามี)
            </label>
            <input
              type="text"
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น อาหารกลางวัน, ค่าน้ำมันไปเชียงใหม่..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editItem ? 'อัปเดตรายการ' : 'บันทึกรายการ'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
