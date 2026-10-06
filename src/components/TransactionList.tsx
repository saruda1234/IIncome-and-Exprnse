import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryMeta } from '../constants/categories';

interface TransactionListProps {
  onOpenAddModal: () => void;
  onEditTransaction: (item: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onOpenAddModal,
  onEditTransaction,
}) => {
  const {
    filteredTransactions,
    deleteTransaction,
    exportCSV,
    seedSampleData,
    loading,
  } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter & Search & Sort
  const displayedTransactions = useMemo(() => {
    return filteredTransactions
      .filter((item) => {
        // Filter by type
        if (filterType !== 'all' && item.type !== filterType) {
          return false;
        }
        // Search by category or note
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCat = item.category.toLowerCase().includes(q);
          const matchNote = (item.note || '').toLowerCase().includes(q);
          if (!matchCat && !matchNote) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [filteredTransactions, filterType, searchQuery, sortBy]);

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const paymentMethodLabels: Record<string, string> = {
    transfer: 'โอนเงิน',
    cash: 'เงินสด',
    credit_card: 'บัตรเครดิต',
    other: 'อื่นๆ',
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>ประวัติรายการธุรกรรม</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {displayedTransactions.length} รายการ
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            ค้นหา ตรวจสอบ และแก้ไขรายการรายรับ-รายจ่าย
          </p>
        </div>

        {/* Action button: Export CSV */}
        <div className="flex items-center gap-2">
          {filteredTransactions.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>ส่งออก CSV</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มรายการ</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาหมวดหมู่ หรือ หมายเหตุ..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills & Sort Select */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type filters */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายรับ
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="date-desc">วันที่ล่าสุด</option>
            <option value="date-asc">วันที่เก่าสุด</option>
            <option value="amount-desc">จำนวนเงินมากสุด</option>
            <option value="amount-asc">จำนวนเงินน้อยสุด</option>
          </select>
        </div>
      </div>

      {/* Transactions List Content */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">กำลังโหลดข้อมูล...</p>
        </div>
      ) : displayedTransactions.length > 0 ? (
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
          {displayedTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMeta(tx.category, tx.type);
            const isDeleting = deleteConfirmId === tx.id;

            return (
              <div
                key={tx.id}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl transition-colors group"
              >
                {/* Left info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${meta.color}18`,
                      color: meta.color,
                    }}
                  >
                    <CategoryIcon iconName={meta.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm truncate">
                        {tx.category}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium shrink-0">
                        {paymentMethodLabels[tx.paymentMethod || 'transfer']}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatThaiDate(tx.date)}
                      </span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] text-slate-600 text-[11px]">
                            {tx.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right amount and actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>

                  {/* Edit & Delete Actions */}
                  {isDeleting ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[11px] text-rose-700 font-semibold px-1">
                        ลบ?
                      </span>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        ยืนยัน
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            ยังไม่มีรายการในเดือนนี้
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            เริ่มต้นบันทึกรายรับหรือรายจ่ายรายการแรกเพื่อดูสรุปผลและการวิเคราะห์ทางสถิติ
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มรายการแรก</span>
            </button>
            <button
              onClick={seedSampleData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>สร้างข้อมูลตัวอย่าง</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
