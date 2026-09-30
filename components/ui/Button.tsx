import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

const BASE = [
  'inline-flex min-h-12 w-full items-center justify-center rounded-(--radius-control) px-6',
  'text-sm font-semibold tracking-[0.08em] whitespace-nowrap uppercase',
  'transition-[background-color,border-color,color,transform] duration-(--dur-micro) ease-out',
  'active:translate-y-px',
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0',
  'aria-busy:cursor-progress',
].join(' ');

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent/90',
  secondary: 'border border-ink-2 text-ink hover:bg-paper-2',
};

interface OwnProps {
  variant?: Variant;
  children: ReactNode;
}

type ButtonProps = OwnProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = OwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Кнопка или ссылка в виде кнопки, если передан href. */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', className = '', children, ...rest } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
}
