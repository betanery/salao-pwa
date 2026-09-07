import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-rosa-quartzo text-cinza-ameixa hover:bg-rosa-antigo hover:text-white',
  secondary: 'bg-lilas-suave text-cinza-ameixa hover:bg-lilas-profundo hover:text-white',
  ghost: 'bg-transparent text-cinza-ameixa hover:bg-pessego-claro',
  danger: 'bg-coral-suave text-cinza-ameixa hover:brightness-95',
}

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
}
