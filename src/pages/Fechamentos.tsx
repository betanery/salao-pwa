import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FieldGroup, Select, Input } from '../components/ui/Field'
import { formatDate, formatMoney, startOfMonthISO, todayISO } from '../lib/format'

const formasPagamento = ['Pix', 'Dinheiro', 'Cartão', 'Transferência']

export function Fechamentos() {
  const [params] = useSearchParams()
  const profissionais = useStore((s) => s.profissionais)
  const atendimentos = useStore((s) => s.atendimentos)
  const fechamentos = useStore((s) => s.fechamentos)
  const clientes = useStore((s) => s.clientes)
  const servicos = useStore((s) => s.servicos)
  const registrarPagamento = useStore((s) => s.registrarPagamento)

  const [profissionalId, setProfissionalId] = useState(params.get('profissionalId') ?? profissionais[0]?.id ?? '')
  const [periodoInicio, setPeriodoInicio] = useState(startOfMonthISO())
  const [periodoFim, setPeriodoFim] = useState(todayISO())
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [pagamentoOpen, setPagamentoOpen] = useState(false)
  const [dataPag, setDataPag] = useState(todayISO())
  const [valorPag, setValorPag] = useState('')
  const [formaPag, setFormaPag] = useState(formasPagamento[0])
  const [obsPag, setObsPag] = useState('')

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? '—'

  const lancamentos = useMemo(
    () =>
      atendimentos
        .filter((a) => a.profissionalId === profissionalId && a.data >= periodoInicio && a.data <= periodoFim)
        .sort((a, b) => b.data.localeCompare(a.data)),
    [atendimentos, profissionalId, periodoInicio, periodoFim]
  )

  const aPagarLancamentos = lancamentos.filter((a) => a.statusRepasse === 'a_pagar')

  const resumo = useMemo(() => {
    const pacotes = lancamentos.filter((a) => a.tipo === 'pacote').reduce((s, a) => s + a.valorRepasse, 0)
    const avulsos = lancamentos.filter((a) => a.tipo === 'avulso').reduce((s, a) => s + a.valorRepasse, 0)
    const pagamentosAnteriores = fechamentos
      .filter((f) => f.profissionalId === profissionalId)
      .flatMap((f) => f.pagamentos)
      .reduce((s, p) => s + p.valor, 0)
    const aPagar = Array.from(selecionados).reduce((s, id) => {
      const at = atendimentos.find((a) => a.id === id)
      return s + (at?.valorRepasse ?? 0)
    }, 0)
    return { pacotes, avulsos, totalProduzido: pacotes + avulsos, pagamentosAnteriores, aPagar }
  }, [lancamentos, fechamentos, profissionalId, selecionados, atendimentos])

  const toggleSelecao = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selecionarTodos = () => {
    if (selecionados.size === aPagarLancamentos.length) {
      setSelecionados(new Set())
    } else {
      setSelecionados(new Set(aPagarLancamentos.map((a) => a.id)))
    }
  }

  const abrirPagamento = () => {
    setValorPag(resumo.aPagar.toFixed(2))
    setDataPag(todayISO())
    setObsPag('')
    setPagamentoOpen(true)
  }

  const handleRegistrarPagamento = (e: React.FormEvent) => {
    e.preventDefault()
    if (selecionados.size === 0) return
    registrarPagamento(profissionalId, Array.from(selecionados), periodoInicio, periodoFim, {
      data: dataPag,
      valor: Number(valorPag),
      forma: formaPag,
      observacao: obsPag || undefined,
    })
    setSelecionados(new Set())
    setPagamentoOpen(false)
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-rosa-antigo mb-4">Fechamento</h1>

      <div className="flex flex-wrap gap-2 mb-5">
        <FieldGroup label="Profissional">
          <Select
            value={profissionalId}
            onChange={(e) => {
              setProfissionalId(e.target.value)
              setSelecionados(new Set())
            }}
            className="w-auto min-w-[180px]"
          >
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="De">
          <Input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Até">
          <Input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {[
          { label: 'Pacotes', valor: resumo.pacotes },
          { label: 'Avulsos', valor: resumo.avulsos },
          { label: 'Total Produzido', valor: resumo.totalProduzido },
          { label: 'Pagamentos Anteriores', valor: resumo.pagamentosAnteriores },
          { label: 'A Pagar (selecionado)', valor: resumo.aPagar },
        ].map((item) => (
          <Card key={item.label} className="p-3">
            <p className="text-[11px] uppercase text-cinza-ameixa/50 mb-1">{item.label}</p>
            <p className="text-sm font-bold">{formatMoney(item.valor)}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-lg font-bold">Lançamentos</h2>
        {aPagarLancamentos.length > 0 && (
          <button onClick={selecionarTodos} className="text-xs font-semibold text-lilas-profundo">
            {selecionados.size === aPagarLancamentos.length ? 'Limpar seleção' : 'Selecionar todos a pagar'}
          </button>
        )}
      </div>

      {lancamentos.length === 0 ? (
        <Card className="text-sm text-cinza-ameixa/60 mb-6">Nenhum lançamento no período.</Card>
      ) : (
        <div className="space-y-2 mb-6">
          {lancamentos.map((a) => (
            <Card key={a.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled={a.statusRepasse === 'pago'}
                checked={selecionados.has(a.id)}
                onChange={() => toggleSelecao(a.id)}
                className="accent-rosa-quartzo w-4 h-4"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {nomeCliente(a.clienteId)} · {nomeServico(a.servicoId)}
                </p>
                <p className="text-xs text-cinza-ameixa/60">
                  {formatDate(a.data)} · {a.tipo === 'pacote' ? 'Pacote' : 'Avulso'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatMoney(a.valorRepasse)}</p>
                <Badge tone={a.statusRepasse === 'pago' ? 'success' : 'pending'}>
                  {a.statusRepasse === 'pago' ? 'Pago' : 'A Pagar'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button fullWidth disabled={selecionados.size === 0} onClick={abrirPagamento}>
        <Wallet size={16} />
        Registrar Pagamento ({selecionados.size})
      </Button>

      <Modal open={pagamentoOpen} onClose={() => setPagamentoOpen(false)} title="Registrar Pagamento">
        <form onSubmit={handleRegistrarPagamento} className="space-y-4">
          <FieldGroup label="Data do pagamento">
            <Input type="date" required value={dataPag} onChange={(e) => setDataPag(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Valor">
            <Input
              type="number"
              min={0}
              step="0.01"
              required
              value={valorPag}
              onChange={(e) => setValorPag(e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Forma de pagamento">
            <Select value={formaPag} onChange={(e) => setFormaPag(e.target.value)}>
              {formasPagamento.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label="Observação (opcional)">
            <Input value={obsPag} onChange={(e) => setObsPag(e.target.value)} />
          </FieldGroup>
          <Button type="submit" fullWidth>
            Confirmar Pagamento
          </Button>
        </form>
      </Modal>
    </div>
  )
}
