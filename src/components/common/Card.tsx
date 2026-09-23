import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'accent' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden';

  const variantStyles = {
    default: 'bg-[#0B0F19] border border-white/[0.08]',
    elevated: 'bg-[#0E1322] border border-white/[0.1] shadow-xl shadow-black/40',
    glass: 'bg-[#0B0F19]/80 backdrop-blur-xl border border-white/[0.08]',
    accent: 'bg-gradient-to-br from-[#0E142B] to-[#0A0D17] border border-indigo-500/20 shadow-lg shadow-indigo-500/5',
    highlight: 'bg-gradient-to-br from-indigo-950/30 via-[#0B0F19] to-[#080B12] border border-indigo-500/30 shadow-xl shadow-indigo-500/10',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-5',
    lg: 'p-6 md:p-7',
  };

  const hoverStyles = hoverEffect
    ? 'hover:border-white/[0.18] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
