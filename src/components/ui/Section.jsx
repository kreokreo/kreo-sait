import { cn } from '@/lib/utils';
import Container from './Container';

export default function Section({
  children,
  className,
  containerSize = 'default',
  background = 'white',
  ...props
}) {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    black: 'bg-black text-white',
  };

  return (
    <section
      className={cn('py-12 md:py-20', backgroundClasses[background], className)}
      {...props}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}

