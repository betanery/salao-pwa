import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useStore, useCurrentUser } from '../lib/store'
import { Button } from '../components/ui/Button'
import { FieldGroup, Input } from '../components/ui/Field'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [recuperar, setRecuperar] = useState(false)
  const [recuperado, setRecuperado] = useState(false)
  const login = useStore((s) => s.login)
  const navigate = useNavigate()
  const user = useCurrentUser()

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = login(email, senha)
    if (!found) {
      setErro('Email ou senha inválidos.')
      return
    }
    navigate('/dashboard')
  }

  const handleRecuperar = (e: FormEvent) => {
    e.preventDefault()
    setRecuperado(true)
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl bg-rosa-quartzo p-3 mb-3">
            <Sparkles className="text-cinza-ameixa" size={28} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Gestão de Salão</h1>
          <p className="text-sm text-cinza-ameixa/70 mt-1">Acesse sua conta para continuar</p>
        </div>

        {!recuperar ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@salao.com"
              />
            </FieldGroup>
            <FieldGroup label="Senha">
              <Input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </FieldGroup>
            {erro && <p className="text-sm text-rosa-antigo font-medium">{erro}</p>}
            <Button type="submit" fullWidth>
              Entrar
            </Button>
            <button
              type="button"
              onClick={() => setRecuperar(true)}
              className="block mx-auto text-sm text-lilas-profundo font-medium mt-2"
            >
              Esqueci senha
            </button>
            <p className="text-xs text-center text-cinza-ameixa/50 pt-2">
              Demo: admin@salao.com / 123456
            </p>
          </form>
        ) : (
          <form onSubmit={handleRecuperar} className="space-y-4">
            {recuperado ? (
              <p className="text-sm text-cinza-ameixa bg-verde-salvia/40 rounded-xl p-3">
                Se o email existir em nossa base, enviaremos instruções de recuperação em instantes.
              </p>
            ) : (
              <FieldGroup label="Email cadastrado">
                <Input type="email" required placeholder="voce@salao.com" />
              </FieldGroup>
            )}
            <Button type="submit" fullWidth disabled={recuperado}>
              Enviar instruções
            </Button>
            <button
              type="button"
              onClick={() => {
                setRecuperar(false)
                setRecuperado(false)
              }}
              className="block mx-auto text-sm text-lilas-profundo font-medium mt-2"
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
