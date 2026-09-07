import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../lib/store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useCurrentUser()
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}
