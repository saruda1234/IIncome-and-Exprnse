import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  LogOut,
  LogIn,
  Cloud,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { user, isDemoUser, loginWithGoogle, logout, enableDemoMode, disableDemoMode } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Income and Expense
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Cloud className="w-3 h-3 text-emerald-600" />
                Firebase Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal hidden sm:block">
              ระบบบันทึกรายรับ-รายจ่าย & สรุปผลรายเดือน
            </p>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-3">
          {/* Add transaction button */}
          {(user || isDemoUser) && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>บันทึกรายการ</span>
            </button>
          )}

          {/* User state */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full ring-2 ring-emerald-500/30 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center text-sm">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.displayName || 'ผู้ใช้งาน'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="ออกจากระบบ"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isDemoUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                โหมดทดลองใช้งาน
              </span>
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                เข้าสู่ระบบ Gmail
              </button>
              <button
                onClick={disableDemoMode}
                className="text-xs text-slate-500 hover:text-slate-800 underline ml-1 cursor-pointer"
              >
                กลับ
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={enableDemoMode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                ดูตัวอย่าง
              </button>
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-all hover:shadow hover:scale-[1.01] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
