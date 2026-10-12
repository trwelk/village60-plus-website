import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold no-underline transition-colors duration-(--duration-fast) min-h-11 focus-visible:outline-3';
const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[17px]',
  lg: 'px-7 py-3.5 text-[18px]',
};
const variants: Record<Variant, string> = {
  primary: 'bg-green text-ivory hover:bg-night',
  secondary: 'border border-green text-green bg-transparent hover:bg-mist',
  text: 'text-green underline underline-offset-4 decoration-gold hover:decoration-green px-1',
};
/** Variants for use inside `.on-dark` sections. */
const darkVariants: Record<Variant, string> = {
  primary: 'bg-ivory text-green hover:bg-paper',
  secondary: 'border border-ivory text-ivory bg-transparent hover:bg-white/10',
  text: 'text-ivory underline underline-offset-4 decoration-pale-gold px-1',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
};
type AnchorProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>;
type ButtonProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = 'primary', size = 'md', onDark = false, className, children, ...rest } = props;
  const classes = cn(base, sizes[size], (onDark ? darkVariants : variants)[variant], className);

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...anchorRest } = rest as AnchorProps;
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
