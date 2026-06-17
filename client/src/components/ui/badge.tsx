import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-white/10 text-white': variant === 'default',
          'bg-white/5 text-white/70': variant === 'secondary',
          'border border-white/20 text-white/70': variant === 'outline',
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
