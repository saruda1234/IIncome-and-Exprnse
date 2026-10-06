import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatThaiMonth } from '../utils/formatters';

export const MonthPicker: React.FC = () => {
  const { selectedMonth, setSelectedMonth } = useTransactions();
  const [isOpenPicker, setIsOpenPicker] = useState(false);

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleResetToCurrent = () => {
    setSelectedMonth(currentMonthStr);
  };

  const isCurrentMonth = selectedMonth === currentMonthStr;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="เดือนก่อนหน้า"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsOpenPicker(!isOpenPicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{formatThaiMonth(selectedMonth)}</span>
          </button>

          {/* Quick Month Select Dropdown */}
          {isOpenPicker && (
            <div className="absolute left-0 top-full mt-2 z-40 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 w-64">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  เลือกปีและเดือน
                </span>
                <button
                  onClick={() => setIsOpenPicker(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ปิด
                </button>
              </div>

              {/* Year Selector */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  onClick={() =>
                    setSelectedMonth(`${year - 1}-${String(month).padStart(2, '0')}`)
                  }
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 rounded-md"
                >
                  &larr; {year + 542}
                </button>
                <span className="text-sm font-bold text-slate-800">
                  พ.ศ. {year + 543} ({year})
                </span>
                <button
                  onClick={() =>
                    setSelectedMonth(`${year + 1}-${String(month).padStart(2, '0')}`)
                  }
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 rounded-md"
                >
                  {year + 544} &rarr;
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                  const mStr = `${year}-${String(m).padStart(2, '0')}`;
                  const isSelected = selectedMonth === mStr;
                  const monthName = formatThaiMonth(mStr, false).split(' ')[0];
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMonth(mStr);
                        setIsOpenPicker(false);
                      }}
                      className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {monthName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="เดือนถัดไป"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Return to current month */}
      {!isCurrentMonth && (
        <button
          onClick={handleResetToCurrent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>กลับเดือนปัจจุบัน</span>
        </button>
      )}
    </div>
  );
};
