import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Input } from '../components/ui/Field'

export function Profissionais() {
  const navigate = useNavigate()
  const profissionais = useStore((s) => s.profissionais)
  const addProfissional = useStore((s) => s.addProfissional)
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [comissao, setComissao] = useState('40')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProfissional({ nome, telefone, email, comissaoPadrao: Number(comissao), ativo: true })
    setOpen(false)
    setNome('')
    setTelefone('')
    setEmail('')
    setComissao('40')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Profissionais</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          Nova
        </Button>
      </div>

      <div className="space-y-2">
        {profissionais.map((p) => (
          <Card
            key={p.id}
            className="flex items-center justify-between cursor-pointer hover:border-rosa-quartzo"
            onClick={() => navigate(`/profissionais/${p.id}`)}
          >
            <div>
              <p className="text-sm font-semibold">{p.nome}</p>
              <p className="text-xs text-cinza-ameixa/60">
                {p.telefone} · Comissão {p.comissaoPadrao}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={p.ativo ? 'success' : 'neutral'}>{p.ativo ? 'Ativa' : 'Inativa'}</Badge>
              <ChevronRight size={18} className="text-cinza-ameixa/40" />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova Profissional">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Nome">
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Telefone">
            <Input required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Comissão padrão (%)">
            <Input
              type="number"
              min={0}
              max={100}
              required
              value={comissao}
              onChange={(e) => setComissao(e.target.value)}
            />
          </FieldGroup>
          <Button type="submit" fullWidth>
            Salvar Profissional
          </Button>
        </form>
      </Modal>
    </div>
  )
}
