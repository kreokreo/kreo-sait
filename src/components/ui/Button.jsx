import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-brand text-brand-foreground hover:bg-brand-dark transition-all',
    outline: 'border border-gray-200 bg-white text-black hover:border-gray-300 hover:bg-gray-50',
    ghost: 'text-black hover:bg-gray-100',
    link: 'text-brand underline-offset-4 hover:underline',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200',
  },
  size: {
    default: 'px-6 py-3 text-base',
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2',
  },
};

export default function Button({
  children,
  variant = 'default',
  size = 'default',
  className,
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

