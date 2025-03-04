
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'small' | 'white';
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'default',
  withTagline = false
}) => {
  const variantClasses = {
    default: 'text-abtec-600',
    small: 'text-abtec-600 text-base',
    white: 'text-white'
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-2">
        <Clock className={cn("h-6 w-6", variantClasses[variant])} strokeWidth={2.5} />
        <span className={cn(
          "font-bold tracking-tight leading-none", 
          variantClasses[variant],
          variant === 'small' ? 'text-xl' : 'text-2xl'
        )}>
          ABTEC
        </span>
      </div>
      {withTagline && (
        <span className={cn(
          "text-xs font-medium mt-1 opacity-80", 
          variant === 'white' ? 'text-white' : 'text-muted-foreground'
        )}>
          Ponto Eletrônico
        </span>
      )}
    </div>
  );
};

export default Logo;
