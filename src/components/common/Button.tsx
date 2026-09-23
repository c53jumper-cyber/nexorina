import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl';

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-[11px] gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4 py-2 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-md shadow-indigo-600/25 border border-indigo-500/30',
    secondary:
      'bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white border border-white/[0.1] active:bg-white/[0.04]',
    outline:
      'bg-transparent text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/10 hover:border-indigo-500/70',
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent',
    danger:
      'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 active:bg-rose-600/40',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
