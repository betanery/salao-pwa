import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Servico } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Input } from '../components/ui/Field'
import { formatMoney } from '../lib/format'

const vazio = { nome: '', categoria: '', duracaoMin: '30', preco: '', ativo: true }

export function Servicos() {
  const servicos = useStore((s) => s.servicos)
  const addServico = useStore((s) => s.addServico)
  const updateServico = useStore((s) => s.updateServico)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState<Servico | null>(null)
  const [form, setForm] = useState(vazio)

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome,
        categoria: editando.categoria,
        duracaoMin: String(editando.duracaoMin),
        preco: String(editando.preco),
        ativo: editando.ativo,
      })
    } else {
      setForm(vazio)
    }
  }, [editando])

  const abrirNovo = () => {
    setEditando(null)
    setOpen(true)
  }

  const abrirEdicao = (s: Servico) => {
    setEditando(s)
    setOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      nome: form.nome,
      categoria: form.categoria,
      duracaoMin: Number(form.duracaoMin),
      preco: Number(form.preco),
      ativo: form.ativo,
    }
    if (editando) updateServico(editando.id, payload)
    else addServico(payload)
    setOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Serviços</h1>
        <Button onClick={abrirNovo}>
          <Plus size={16} />
          Novo
        </Button>
      </div>

      <div className="space-y-2">
        {servicos.map((s) => (
          <Card
            key={s.id}
            className="flex items-center justify-between cursor-pointer hover:border-rosa-quartzo"
            onClick={() => abrirEdicao(s)}
          >
            <div>
              <p className="text-sm font-semibold">{s.nome}</p>
              <p className="text-xs text-cinza-ameixa/60">
                {s.categoria} · {s.duracaoMin} min
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatMoney(s.preco)}</p>
              <Badge tone={s.ativo ? 'success' : 'neutral'}>{s.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editando ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Nome">
            <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Categoria">
            <Input
              required
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Duração (min)">
              <Input
                type="number"
                min={5}
                required
                value={form.duracaoMin}
                onChange={(e) => setForm({ ...form, duracaoMin: e.target.value })}
              />
            </FieldGroup>
            <FieldGroup label="Preço (R$)">
              <Input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
              />
            </FieldGroup>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              className="accent-rosa-quartzo"
            />
            Serviço ativo
          </label>
          <Button type="submit" fullWidth>
            Salvar Serviço
          </Button>
        </form>
      </Modal>
    </div>
  )
}
