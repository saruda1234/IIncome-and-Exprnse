import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  ShieldCheck,
  BarChart2,
  Calendar,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { loginWithGoogle, enableDemoMode, error, clearError } = useAuth();

  return (
    <div className="py-10 sm:py-16 px-4 max-w-5xl mx-auto">
      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-xs font-bold text-rose-800 underline ml-2 cursor-pointer"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800 text-center">
        {/* Glow background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>เชื่อมต่อฐานข้อมูล Firebase เรียบร้อยแล้ว</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            จัดการรายรับรายจ่าย <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              วิเคราะห์การเงินอย่างชาญฉลาด
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            สรุปผลแบบรายเดือนอัตโนมัติ กราฟวิเคราะห์การใช้จ่ายแยกตามหมวดหมู่
            และจัดเก็บข้อมูลอย่างปลอดภัยบนระบบคลาวด์ Firebase ของโปรเจกต์ Income and expense
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>เข้าสู่ระบบด้วย Gmail</span>
            </button>

            <button
              onClick={enableDemoMode}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ทดลองใช้งาน (Demo)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> ปลอดภัย 100%
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> แยกข้อมูลส่วนบุคคลต่อบัญชี
            </span>
          </div>
        </div>
      </div>

      {/* 3 Pillars Feature Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            สรุปผลรอบเดือนอัตโนมัติ
          </h3>
          <p className="text-xs text-slate-500">
            ดูรายรับ รายจ่าย ยอดคงเหลือสุทธิ อัตราการออม และควบคุมงบประมาณรายเดือนได้ทันที
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            กราฟวิเคราะห์ข้อมูลชัดเจน
          </h3>
          <p className="text-xs text-slate-500">
            โดนัทชาร์ตแยกตามหมวดหมู่, กราฟเปรียบเทียบย้อนหลัง 6 เดือน และกระแสเงินสดรายวัน
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            ซิงค์คลาวด์ Firebase & Gmail
          </h3>
          <p className="text-xs text-slate-500">
            เข้าสู่ระบบด้วย Gmail บันทึกข้อมูลลง Firestore แบบเรียลไทม์ พร้อมสิทธิ์ความปลอดภัยสูงสุด
          </p>
        </div>
      </div>
    </div>
  );
};
