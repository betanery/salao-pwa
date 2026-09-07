import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, ChevronRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Input } from '../components/ui/Field'

export function Clientes() {
  const navigate = useNavigate()
  const clientes = useStore((s) => s.clientes)
  const addCliente = useStore((s) => s.addCliente)
  const [busca, setBusca] = useState('')
  const [novoOpen, setNovoOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return clientes
    return clientes.filter(
      (c) => c.nome.toLowerCase().includes(termo) || c.telefone.replace(/\D/g, '').includes(termo.replace(/\D/g, ''))
    )
  }, [clientes, busca])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cliente = addCliente({ nome, telefone, email })
    setNovoOpen(false)
    setNome('')
    setTelefone('')
    setEmail('')
    navigate(`/clientes/${cliente.id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Clientes</h1>
        <Button onClick={() => setNovoOpen(true)}>
          <Plus size={16} />
          Nova
        </Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-ameixa/40" />
        <Input
          placeholder="Buscar por nome ou telefone"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {filtrados.map((c) => (
          <Card
            key={c.id}
            className="flex items-center justify-between cursor-pointer hover:border-rosa-quartzo"
            onClick={() => navigate(`/clientes/${c.id}`)}
          >
            <div>
              <p className="text-sm font-semibold">{c.nome}</p>
              <p className="text-xs text-cinza-ameixa/60">{c.telefone}</p>
            </div>
            <ChevronRight size={18} className="text-cinza-ameixa/40" />
          </Card>
        ))}
        {filtrados.length === 0 && (
          <Card className="text-sm text-cinza-ameixa/60">Nenhuma cliente encontrada.</Card>
        )}
      </div>

      <Modal open={novoOpen} onClose={() => setNovoOpen(false)} title="Nova Cliente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Nome">
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Telefone">
            <Input
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(61) 90000-0000"
            />
          </FieldGroup>
          <FieldGroup label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FieldGroup>
          <Button type="submit" fullWidth>
            Salvar Cliente
          </Button>
        </form>
      </Modal>
    </div>
  )
}
