import { cn } from '@/lib/utils';
import {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  SVGProps,
  forwardRef,
} from 'react';

type ButtonProps = {
  variant?: 'form' | 'button';
  children: ReactNode;
  Icon?: ForwardRefExoticComponent<PropsWithoutRef<SVGProps<SVGSVGElement>>>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'button', children, onClick, Icon, ...props }, ref) => {
    return (
      <button
        className={cn(
          'px-2.5 py-1.5 flex items-center justify-between rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1',
          {
            'border-black hover:bg-black hover:text-white transition-colors duration-200 ease-in-out':
              variant === 'button',
          },
        )}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        <span>{children}</span>
        {Icon && <Icon className="h-5 w-5" />}
        {/* {loading && <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />} */}
      </button>
    );
  },
);

Button.displayName = 'Button';
