import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import type { PacoteItem, PacoteModelo } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Input, Select } from '../components/ui/Field'
import { formatMoney } from '../lib/format'

export function Pacotes() {
  const pacotes = useStore((s) => s.pacoteModelos)
  const servicos = useStore((s) => s.servicos)
  const addPacoteModelo = useStore((s) => s.addPacoteModelo)
  const updatePacoteModelo = useStore((s) => s.updatePacoteModelo)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState<PacoteModelo | null>(null)
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [itens, setItens] = useState<PacoteItem[]>([{ servicoId: '', quantidade: 1 }])

  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? '—'

  useEffect(() => {
    if (editando) {
      setNome(editando.nome)
      setPreco(String(editando.preco))
      setAtivo(editando.ativo)
      setItens(editando.itens.length ? editando.itens : [{ servicoId: '', quantidade: 1 }])
    } else {
      setNome('')
      setPreco('')
      setAtivo(true)
      setItens([{ servicoId: '', quantidade: 1 }])
    }
  }, [editando, open])

  const abrirNovo = () => {
    setEditando(null)
    setOpen(true)
  }

  const abrirEdicao = (p: PacoteModelo) => {
    setEditando(p)
    setOpen(true)
  }

  const atualizarItem = (index: number, campo: keyof PacoteItem, valor: string | number) => {
    setItens((prev) => prev.map((it, i) => (i === index ? { ...it, [campo]: valor } : it)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const itensValidos = itens.filter((i) => i.servicoId && i.quantidade > 0)
    if (!itensValidos.length) return
    const payload = { nome, itens: itensValidos, preco: Number(preco), ativo }
    if (editando) updatePacoteModelo(editando.id, payload)
    else addPacoteModelo(payload)
    setOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Pacotes</h1>
        <Button onClick={abrirNovo}>
          <Plus size={16} />
          Novo
        </Button>
      </div>

      <div className="space-y-2">
        {pacotes.map((p) => (
          <Card key={p.id} className="cursor-pointer hover:border-rosa-quartzo" onClick={() => abrirEdicao(p)}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold">{p.nome}</p>
              <Badge tone={p.ativo ? 'success' : 'neutral'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </div>
            <p className="text-xs text-cinza-ameixa/60 mb-1">
              {p.itens.map((i) => `${i.quantidade}x ${nomeServico(i.servicoId)}`).join(' + ')}
            </p>
            <p className="text-sm font-semibold text-rosa-antigo">{formatMoney(p.preco)}</p>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editando ? 'Editar Pacote' : 'Novo Pacote'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Nome do pacote">
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </FieldGroup>

          <div>
            <p className="text-xs font-semibold text-rosa-antigo mb-2">Itens do pacote</p>
            <div className="space-y-2">
              {itens.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={item.servicoId}
                    onChange={(e) => atualizarItem(index, 'servicoId', e.target.value)}
                    className="flex-1"
                  >
                    <option value="">Serviço</option>
                    {servicos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                    className="w-16"
                  />
                  <button
                    type="button"
                    onClick={() => setItens((prev) => prev.filter((_, i) => i !== index))}
                    className="p-2 text-cinza-ameixa/40 hover:text-coral-suave"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setItens((prev) => [...prev, { servicoId: '', quantidade: 1 }])}
              className="mt-2 text-sm font-semibold text-lilas-profundo"
            >
              + Adicionar serviço
            </button>
          </div>

          <FieldGroup label="Preço do pacote (R$)">
            <Input type="number" min={0} step="0.01" required value={preco} onChange={(e) => setPreco(e.target.value)} />
          </FieldGroup>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="accent-rosa-quartzo"
            />
            Pacote ativo para venda
          </label>

          <Button type="submit" fullWidth>
            Salvar Pacote
          </Button>
        </form>
      </Modal>
    </div>
  )
}
