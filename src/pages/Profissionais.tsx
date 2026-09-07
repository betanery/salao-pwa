import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import type { ComissaoServico, Profissional, TipoComissao } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Input, Select } from '../components/ui/Field'
import { formatComissao } from '../lib/comissao'

const vazio = { nome: '', telefone: '', email: '', comissao: '40' }

export function Profissionais() {
  const navigate = useNavigate()
  const profissionais = useStore((s) => s.profissionais)
  const todosServicos = useStore((s) => s.servicos)
  const servicos = todosServicos.filter((sv) => sv.ativo)
  const addProfissional = useStore((s) => s.addProfissional)
  const updateProfissional = useStore((s) => s.updateProfissional)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState<Profissional | null>(null)
  const [form, setForm] = useState(vazio)
  const [excecoes, setExcecoes] = useState<ComissaoServico[]>([])

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome,
        telefone: editando.telefone,
        email: editando.email,
        comissao: String(editando.comissaoPadrao),
      })
      setExcecoes(editando.comissoesServicos ?? [])
    } else {
      setForm(vazio)
      setExcecoes([])
    }
  }, [editando, open])

  const abrirNovo = () => {
    setEditando(null)
    setOpen(true)
  }

  const abrirEdicao = (p: Profissional) => {
    setEditando(p)
    setOpen(true)
  }

  const atualizarExcecao = (index: number, campo: keyof ComissaoServico, valor: string | number) => {
    setExcecoes((prev) => prev.map((ex, i) => (i === index ? { ...ex, [campo]: valor } : ex)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const excecoesValidas = excecoes.filter((ex) => ex.servicoId && ex.valor >= 0)
    const payload = {
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      comissaoPadrao: Number(form.comissao),
      comissoesServicos: excecoesValidas,
      ativo: editando?.ativo ?? true,
    }
    if (editando) updateProfissional(editando.id, payload)
    else addProfissional(payload)
    setOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Profissionais</h1>
        <Button onClick={abrirNovo}>
          <Plus size={16} />
          Nova
        </Button>
      </div>

      <div className="space-y-2">
        {profissionais.map((p) => (
          <Card key={p.id} className="flex items-center justify-between">
            <button
              className="flex-1 min-w-0 text-left"
              onClick={() => navigate(`/profissionais/${p.id}`)}
            >
              <p className="text-sm font-semibold">{p.nome}</p>
              <p className="text-xs text-cinza-ameixa/60">
                {p.telefone} · Comissão padrão {p.comissaoPadrao}%
              </p>
              {p.comissoesServicos && p.comissoesServicos.length > 0 && (
                <p className="text-xs text-lilas-profundo mt-0.5">
                  {p.comissoesServicos
                    .map((ex) => {
                      const nomeServico = todosServicos.find((s) => s.id === ex.servicoId)?.nome ?? '—'
                      return `${nomeServico}: ${formatComissao(ex.tipo, ex.valor)}`
                    })
                    .join(' · ')}
                </p>
              )}
            </button>
            <div className="flex items-center gap-2">
              <Badge tone={p.ativo ? 'success' : 'neutral'}>{p.ativo ? 'Ativa' : 'Inativa'}</Badge>
              <button
                onClick={() => abrirEdicao(p)}
                className="p-1.5 text-cinza-ameixa/40 hover:text-rosa-antigo"
                aria-label="Editar profissional"
              >
                <Pencil size={16} />
              </button>
              <ChevronRight
                size={18}
                className="text-cinza-ameixa/40 cursor-pointer"
                onClick={() => navigate(`/profissionais/${p.id}`)}
              />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editando ? 'Editar Profissional' : 'Nova Profissional'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Nome">
            <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Telefone">
            <Input
              required
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Comissão padrão (%)">
            <Input
              type="number"
              min={0}
              max={100}
              required
              value={form.comissao}
              onChange={(e) => setForm({ ...form, comissao: e.target.value })}
            />
          </FieldGroup>

          <div>
            <p className="text-xs font-semibold text-rosa-antigo mb-1">
              Exceções de comissão por serviço (opcional)
            </p>
            <p className="text-xs text-cinza-ameixa/50 mb-2">
              Use para serviços em que a comissão foge do padrão — em % ou em valor fixo por atendimento.
            </p>
            <div className="space-y-2">
              {excecoes.map((ex, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={ex.servicoId}
                    onChange={(e) => atualizarExcecao(index, 'servicoId', e.target.value)}
                    className="flex-1"
                  >
                    <option value="">Serviço</option>
                    {servicos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={ex.tipo}
                    onChange={(e) => atualizarExcecao(index, 'tipo', e.target.value as TipoComissao)}
                    className="w-28"
                  >
                    <option value="percentual">%</option>
                    <option value="fixo">R$ fixo</option>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ex.valor}
                    onChange={(e) => atualizarExcecao(index, 'valor', Number(e.target.value))}
                    className="w-24"
                  />
                  <button
                    type="button"
                    onClick={() => setExcecoes((prev) => prev.filter((_, i) => i !== index))}
                    className="p-2 text-cinza-ameixa/40 hover:text-coral-suave"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setExcecoes((prev) => [...prev, { servicoId: '', tipo: 'percentual', valor: 0 }])
              }
              className="mt-2 text-sm font-semibold text-lilas-profundo"
            >
              + Adicionar exceção
            </button>
          </div>

          <Button type="submit" fullWidth>
            Salvar Profissional
          </Button>
        </form>
      </Modal>
    </div>
  )
}