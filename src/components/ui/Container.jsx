import { cn } from '@/lib/utils';

export default function Container({ children, className, size = 'default', ...props }) {
  const sizeClasses = {
    default: 'max-w-7xl',
    sm: 'max-w-4xl',
    lg: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-6 md:px-12',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

