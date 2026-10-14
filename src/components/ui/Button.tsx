import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import type { LucideIcon } from '@/components/icons';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';

interface Common {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  children: ReactNode;
}

export function buttonClass({
  variant = 'primary',
  fullWidth,
  className,
}: {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}) {
  return [styles.button, styles[variant], fullWidth ? styles.full : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

function Content({ icon: Icon, iconPosition = 'end', children }: Common) {
  return (
    <>
      {Icon && iconPosition === 'start' ? (
        <Icon size={18} strokeWidth={2.25} aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === 'end' ? (
        <Icon size={18} strokeWidth={2.25} aria-hidden="true" />
      ) : null}
    </>
  );
}

/** Bouton d'action (élément <button> natif). */
export function Button({
  variant,
  icon,
  iconPosition,
  fullWidth,
  children,
  className,
  type = 'button',
  ...rest
}: Common & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button type={type} className={buttonClass({ variant, fullWidth, className })} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

/** Lien présenté comme un bouton (navigation). */
export function ButtonLink({
  variant,
  icon,
  iconPosition,
  fullWidth,
  children,
  className,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, 'children'>) {
  return (
    <Link className={buttonClass({ variant, fullWidth, className })} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  );
}
