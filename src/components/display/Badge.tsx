import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../ui/Button';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-subtle text-primary',
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-brand-100 text-brand-700',
        warning: 'bg-warning-50 text-amber-700',
        danger: 'bg-danger-50 text-red-700',
        outline: 'text-primary border border-soft',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
