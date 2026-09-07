import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-cinza-ameixa/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-offwhite p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cinza-ameixa">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-cinza-ameixa hover:bg-pessego-claro"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
