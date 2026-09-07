import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  UserRound,
  Scissors,
  Package,
  Wallet,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { useStore, useCurrentUser } from '../lib/store'

const navItems = [
  { to: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/atendimento/novo', label: 'Atender', icon: Sparkles },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/profissionais', label: 'Equipe', icon: UserRound },
  { to: '/servicos', label: 'Serviços', icon: Scissors },
  { to: '/pacotes', label: 'Pacotes', icon: Package },
  { to: '/fechamentos', label: 'Fechamento', icon: Wallet },
]

const mobileMain = navItems.slice(0, 4)
const mobileMore = navItems.slice(4)

export function Layout() {
  const [moreOpen, setMoreOpen] = useState(false)
  const navigate = useNavigate()
  const logout = useStore((s) => s.logout)
  const user = useCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-dvh flex bg-offwhite">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-lilas-suave/60 md:bg-white/60 md:p-4">
        <div className="mb-6 px-2">
          <h1 className="font-heading text-xl font-bold text-rosa-antigo">Gestão de Salão</h1>
          {user && <p className="text-xs text-cinza-ameixa/70 mt-1">{user.nome}</p>}
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-rosa-quartzo text-cinza-ameixa'
                    : 'text-cinza-ameixa/80 hover:bg-pessego-claro'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cinza-ameixa/70 hover:bg-coral-suave/40"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur border-b border-lilas-suave/60 px-4 py-3">
          <h1 className="font-heading text-lg font-bold text-rosa-antigo">Gestão de Salão</h1>
          <button onClick={handleLogout} className="text-cinza-ameixa/70 p-1.5" aria-label="Sair">
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 pb-24 md:pb-6 px-4 py-4 md:px-8 md:py-6 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch bg-white/95 backdrop-blur border-t border-lilas-suave/60 pb-[env(safe-area-inset-bottom)]">
        {mobileMain.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium',
                isActive ? 'text-rosa-antigo' : 'text-cinza-ameixa/60'
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-cinza-ameixa/60"
        >
          <Menu size={20} />
          Mais
        </button>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex items-end bg-cinza-ameixa/40" onClick={() => setMoreOpen(false)}>
          <div
            className="w-full rounded-t-3xl bg-offwhite p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Mais opções</h2>
              <button onClick={() => setMoreOpen(false)} className="p-1.5" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mobileMore.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-pessego-claro/60 py-4 text-xs font-medium text-cinza-ameixa"
                >
                  <Icon size={22} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
