import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatThaiMonth } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryMeta } from '../constants/categories';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { monthlyStats, sixMonthsTrend, selectedMonth } = useTransactions();
  const [activeTab, setActiveTab] = useState<'donut' | 'bars' | 'trend'>('donut');
  const [donutType, setDonutType] = useState<'expense' | 'income'>('expense');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Filter breakdown for donut by type
  const targetBreakdown = monthlyStats.categoryBreakdown.filter(
    (c) => c.type === donutType
  );
  const totalForDonut = donutType === 'expense' ? monthlyStats.totalExpense : monthlyStats.totalIncome;

  // Donut SVG path calculations
  const size = 260;
  const center = size / 2;
  const radius = 100;
  const innerRadius = 64;

  let cumulativeAngle = -Math.PI / 2; // Start from top 12 o'clock

  const donutSlices = targetBreakdown.map((item) => {
    const fraction = totalForDonut > 0 ? item.amount / totalForDonut : 0;
    const sliceAngle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle += sliceAngle;

    // SVG arc coordinates
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(endAngle);
    const iy1 = center + innerRadius * Math.sin(endAngle);
    const ix2 = center + innerRadius * Math.cos(startAngle);
    const iy2 = center + innerRadius * Math.sin(startAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    // Path command
    const path =
      fraction >= 0.999
        ? `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${
            center + radius
          } A ${radius} ${radius} 0 1 1 ${center} ${
            center - radius
          } M ${center} ${center - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${
            center + innerRadius
          } A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center - innerRadius} Z`
        : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    return {
      ...item,
      path,
      fraction,
    };
  });

  // 6 months bar chart maximum calculation
  const maxBarValue = Math.max(
    ...sixMonthsTrend.map((m) => Math.max(m.income, m.expense)),
    1000
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>กราฟวิเคราะห์ข้อมูลการเงิน</span>
          </h2>
          <p className="text-xs text-slate-500">
            แสดงสัดส่วนรายรับ-รายจ่าย และแนวโน้มสถิติ
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'donut'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>สัดส่วนหมวดหมู่</span>
          </button>

          <button
            onClick={() => setActiveTab('bars')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bars'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>แนวโน้ม 6 เดือน</span>
          </button>

          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'trend'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <span>กระแสเงินสดรายวัน</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Donut Chart with Category Breakdown */}
      {activeTab === 'donut' && (
        <div className="space-y-6">
          {/* Toggle Income vs Expense */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setDonutType('expense')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                donutType === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              สัดส่วนรายจ่าย ({formatCurrency(monthlyStats.totalExpense)})
            </button>
            <button
              onClick={() => setDonutType('income')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                donutType === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              สัดส่วนรายรับ ({formatCurrency(monthlyStats.totalIncome)})
            </button>
          </div>

          {targetBreakdown.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Donut graphic */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative">
                  <svg width={size} height={size} className="overflow-visible">
                    <g>
                      {donutSlices.map((slice, idx) => {
                        const isHovered = hoveredSlice === slice.category;
                        return (
                          <path
                            key={idx}
                            d={slice.path}
                            fill={slice.color}
                            className="transition-all duration-200 cursor-pointer hover:opacity-90"
                            style={{
                              transformOrigin: `${center}px ${center}px`,
                              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                            }}
                            onMouseEnter={() => setHoveredSlice(slice.category)}
                            onMouseLeave={() => setHoveredSlice(null)}
                          />
                        );
                      })}
                    </g>
                  </svg>

                  {/* Donut Center Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {hoveredSlice || (donutType === 'expense' ? 'รายจ่ายรวม' : 'รายรับรวม')}
                    </span>
                    <span className="text-lg font-extrabold text-slate-800 leading-tight">
                      {hoveredSlice
                        ? formatCurrency(
                            targetBreakdown.find((x) => x.category === hoveredSlice)?.amount ||
                              0
                          )
                        : formatCurrency(totalForDonut)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {hoveredSlice
                        ? `${
                            targetBreakdown.find((x) => x.category === hoveredSlice)
                              ?.percentage || 0
                          }% ของทั้งหมด`
                        : `${targetBreakdown.length} หมวดหมู่`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Legend & Percentages */}
              <div className="md:col-span-7 space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  จำแนกตามหมวดหมู่ ({donutType === 'expense' ? 'รายจ่าย' : 'รายรับ'})
                </h4>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {targetBreakdown.map((item) => {
                    const isHovered = hoveredSlice === item.category;
                    const meta = getCategoryMeta(item.category, item.type);
                    return (
                      <div
                        key={item.category}
                        onMouseEnter={() => setHoveredSlice(item.category)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                          isHovered
                            ? 'bg-slate-50 border-slate-300 shadow-xs'
                            : 'border-slate-100 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${item.color}18`, color: item.color }}
                            >
                              <CategoryIcon iconName={meta.icon} className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({item.count} รายการ)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">
                              {formatCurrency(item.amount)}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">ไม่มีข้อมูล{donutType === 'expense' ? 'รายจ่าย' : 'รายรับ'}ในเดือนนี้</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 6 Months Trend Bar Chart */}
      {activeTab === 'bars' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>เปรียบเทียบรายรับและรายจ่ายย้อนหลัง 6 เดือน</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                รายรับ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                รายจ่าย
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-200">
            {sixMonthsTrend.map((m) => {
              const incomeHeight = maxBarValue > 0 ? (m.income / maxBarValue) * 100 : 0;
              const expenseHeight = maxBarValue > 0 ? (m.expense / maxBarValue) * 100 : 0;
              const isSelected = m.month === selectedMonth;
              const monthLabel = formatThaiMonth(m.month, false).split(' ')[0];

              return (
                <div
                  key={m.month}
                  className={`flex-1 flex flex-col items-center h-full justify-end group relative ${
                    isSelected ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-14 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                    <p className="font-bold text-slate-200">{formatThaiMonth(m.month)}</p>
                    <p className="text-emerald-400">รับ: {formatCurrency(m.income)}</p>
                    <p className="text-rose-400">จ่าย: {formatCurrency(m.expense)}</p>
                  </div>

                  {/* Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Income Bar */}
                    <div className="w-full max-w-[28px] flex flex-col items-center justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-300"
                        style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                      />
                    </div>

                    {/* Expense Bar */}
                    <div className="w-full max-w-[28px] flex flex-col items-center justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-300"
                        style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 text-center text-xs font-medium ${
                      isSelected
                        ? 'text-emerald-700 font-bold underline decoration-emerald-500 underline-offset-4'
                        : 'text-slate-600'
                    }`}
                  >
                    {monthLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {sixMonthsTrend.slice(-3).map((m) => (
              <div key={m.month} className="bg-slate-50 rounded-xl p-3 text-xs border border-slate-200/60">
                <span className="font-semibold text-slate-700 block mb-1">
                  {formatThaiMonth(m.month, false)}
                </span>
                <div className="flex justify-between text-slate-500">
                  <span>สุทธิ:</span>
                  <span
                    className={`font-bold ${
                      m.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {formatCurrency(m.net)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Cash Flow Area Chart */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>บันทึกการใช้จ่ายและรับเงินในแต่ละวันของเดือน</span>
            <span className="text-slate-400">วันที่ 1 ถึง สิ้นเดือน</span>
          </div>

          {monthlyStats.dailyTrend.length > 0 ? (
            <div className="relative h-60 w-full pt-4">
              {(() => {
                const maxDayValue = Math.max(
                  ...monthlyStats.dailyTrend.map((d) => Math.max(d.income, d.expense)),
                  500
                );
                const chartWidth = 600;
                const chartHeight = 200;
                const pointsCount = monthlyStats.dailyTrend.length;
                const dx = chartWidth / (pointsCount - 1 || 1);

                // Build line paths
                const incomePoints = monthlyStats.dailyTrend.map((d, i) => {
                  const x = i * dx;
                  const y = chartHeight - (d.income / maxDayValue) * (chartHeight - 20) - 10;
                  return `${x},${y}`;
                });

                const expensePoints = monthlyStats.dailyTrend.map((d, i) => {
                  const x = i * dx;
                  const y = chartHeight - (d.expense / maxDayValue) * (chartHeight - 20) - 10;
                  return `${x},${y}`;
                });

                const incomePath = `M ${incomePoints.join(' L ')}`;
                const expensePath = `M ${expensePoints.join(' L ')}`;

                return (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1={chartHeight / 4} x2={chartWidth} y2={chartHeight / 4} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="0" y1={(chartHeight * 3) / 4} x2={chartWidth} y2={(chartHeight * 3) / 4} stroke="#E2E8F0" strokeDasharray="3 3" />

                    {/* Expense line & area */}
                    <path
                      d={`${expensePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                      fill="url(#expenseGrad)"
                    />
                    <path
                      d={expensePath}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Income line & area */}
                    <path
                      d={`${incomePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                      fill="url(#incomeGrad)"
                    />
                    <path
                      d={incomePath}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Circles for active days */}
                    {monthlyStats.dailyTrend.map((d, i) => {
                      const x = i * dx;
                      const hasInc = d.income > 0;
                      const hasExp = d.expense > 0;
                      return (
                        <g key={d.day}>
                          {hasInc && (
                            <circle
                              cx={x}
                              cy={chartHeight - (d.income / maxDayValue) * (chartHeight - 20) - 10}
                              r="3.5"
                              fill="#10B981"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          )}
                          {hasExp && (
                            <circle
                              cx={x}
                              cy={chartHeight - (d.expense / maxDayValue) * (chartHeight - 20) - 10}
                              r="3.5"
                              fill="#EF4444"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">ไม่มีข้อมูลรายวัน</p>
          )}

          <div className="flex items-center justify-center gap-6 text-xs pt-2">
            <span className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded-full" />
              <span>รายรับรายวัน</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-rose-500 inline-block rounded-full" />
              <span>รายจ่ายรายวัน</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
