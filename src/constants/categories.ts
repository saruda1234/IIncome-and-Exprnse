import { CategoryItem } from '../types';

export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'food', name: 'อาหารและเครื่องดื่ม', icon: 'Utensils', color: '#EF4444', type: 'expense' },
  { id: 'transport', name: 'การเดินทางและน้ำมัน', icon: 'Car', color: '#F97316', type: 'expense' },
  { id: 'housing', name: 'ที่อยู่อาศัยและค่าเช่า', icon: 'Home', color: '#8B5CF6', type: 'expense' },
  { id: 'utilities', name: 'ค่าน้ำ-ไฟ-อินเทอร์เน็ต', icon: 'Zap', color: '#06B6D4', type: 'expense' },
  { id: 'shopping', name: 'ช้อปปิ้งและของใช้', icon: 'ShoppingBag', color: '#EC4899', type: 'expense' },
  { id: 'entertainment', name: 'บันเทิงและท่องเที่ยว', icon: 'Film', color: '#3B82F6', type: 'expense' },
  { id: 'health', name: 'สุขภาพและยารักษาโรค', icon: 'HeartPulse', color: '#10B981', type: 'expense' },
  { id: 'education', name: 'การศึกษาและพัฒนาตนเอง', icon: 'GraduationCap', color: '#6366F1', type: 'expense' },
  { id: 'investment_exp', name: 'ออมเงินและประกัน', icon: 'PiggyBank', color: '#14B8A6', type: 'expense' },
  { id: 'family', name: 'ครอบครัวและสัตว์เลี้ยง', icon: 'Users', color: '#F59E0B', type: 'expense' },
  { id: 'other_expense', name: 'ค่าใช้จ่ายอื่นๆ', icon: 'MoreHorizontal', color: '#64748B', type: 'expense' },
];

export const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', name: 'เงินเดือนและค่าจ้าง', icon: 'Briefcase', color: '#10B981', type: 'income' },
  { id: 'bonus', name: 'โบนัสและเงินพิเศษ', icon: 'Gift', color: '#059669', type: 'income' },
  { id: 'investment_inc', name: 'ดอกเบี้ยและเงินปันผล', icon: 'TrendingUp', color: '#047857', type: 'income' },
  { id: 'business', name: 'ธุรกิจส่วนตัวและค้าขาย', icon: 'Store', color: '#0D9488', type: 'income' },
  { id: 'freelance', name: 'งานเสริมและฟรีแลนซ์', icon: 'Laptop', color: '#0284C7', type: 'income' },
  { id: 'transfer_in', name: 'รับโอนเงินและอื่นๆ', icon: 'ArrowDownLeft', color: '#8B5CF6', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryMeta(name: string, type: 'income' | 'expense' = 'expense'): CategoryItem {
  const found = ALL_CATEGORIES.find((c) => c.name === name);
  if (found) return found;
  return {
    id: 'unknown',
    name,
    icon: type === 'income' ? 'ArrowDownLeft' : 'CreditCard',
    color: type === 'income' ? '#10B981' : '#EF4444',
    type,
  };
}
