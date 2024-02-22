import { forwardRef, ForwardRefExoticComponent, InputHTMLAttributes, PropsWithoutRef, SVGProps } from 'react';
import clsx from 'clsx';

type InputProps = {
  Icon?: ForwardRefExoticComponent<PropsWithoutRef<SVGProps<SVGSVGElement>>>;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ Icon, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        {...props}
        className={clsx(
          'w-full rounded-md border py-1 pl-1.5 focus-visible:border-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-1',
        )}
        ref={ref}
      />
      <span className="absolute right-1.5 top-1/2 flex -translate-y-1/2 space-x-1 text-secondary-400">
        {Icon && <Icon className="h-5 w-5" />}
      </span>
    </div>
  );
});

Input.displayName = 'Input';
