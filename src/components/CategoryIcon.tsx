import React from 'react';
import {
  Utensils,
  Car,
  Home,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  PiggyBank,
  Users,
  MoreHorizontal,
  Briefcase,
  Gift,
  TrendingUp,
  Store,
  Laptop,
  ArrowDownLeft,
  CreditCard,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  className = 'w-5 h-5',
  color,
}) => {
  const iconProps = {
    className,
    style: color ? { color } : undefined,
  };

  switch (iconName) {
    case 'Utensils':
      return <Utensils {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Film':
      return <Film {...iconProps} />;
    case 'HeartPulse':
      return <HeartPulse {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'PiggyBank':
      return <PiggyBank {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'MoreHorizontal':
      return <MoreHorizontal {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    case 'Gift':
      return <Gift {...iconProps} />;
    case 'TrendingUp':
      return <TrendingUp {...iconProps} />;
    case 'Store':
      return <Store {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'ArrowDownLeft':
      return <ArrowDownLeft {...iconProps} />;
    case 'CreditCard':
      return <CreditCard {...iconProps} />;
    case 'DollarSign':
      return <DollarSign {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};
