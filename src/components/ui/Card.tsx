import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white/70 border border-lilas-suave/60 shadow-sm p-4',
        className
      )}
      {...props}
    />
  )
}
