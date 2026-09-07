import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

const baseClass =
  'w-full rounded-xl border border-lilas-suave bg-white px-3 py-2.5 text-sm text-cinza-ameixa placeholder:text-cinza-ameixa/40 focus:outline-none focus:ring-2 focus:ring-rosa-quartzo'

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-semibold text-rosa-antigo mb-1">{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(baseClass, props.className)} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx(baseClass, props.className)} />
}

export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
