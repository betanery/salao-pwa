import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Wallet } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDate, formatMoney, todayISO, startOfWeekISO, startOfMonthISO } from '../lib/format'

export function ProfissionalProducao() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const profissional = useStore((s) => s.profissionais.find((p) => p.id === id))
  const atendimentos = useStore((s) => s.atendimentos).filter((a) => a.profissionalId === id)
  const clientes = useStore((s) => s.clientes)
  const servicos = useStore((s) => s.servicos)

  const nomeCliente = (cid: string) => clientes.find((c) => c.id === cid)?.nome ?? '—'
  const nomeServico = (sid: string) => servicos.find((s) => s.id === sid)?.nome ?? '—'

  const resumo = useMemo(() => {
    const hoje = todayISO()
    const inicioSemana = startOfWeekISO()
    const inicioMes = startOfMonthISO()
    const soma = (lista: typeof atendimentos) => lista.reduce((s, a) => s + a.valorRepasse, 0)
    return {
      hoje: soma(atendimentos.filter((a) => a.data === hoje)),
      semana: soma(atendimentos.filter((a) => a.data >= inicioSemana)),
      mes: soma(atendimentos.filter((a) => a.data >= inicioMes)),
      aReceber: soma(atendimentos.filter((a) => a.statusRepasse === 'a_pagar')),
      pago: soma(atendimentos.filter((a) => a.statusRepasse === 'pago')),
    }
  }, [atendimentos])

  if (!profissional) return <p className="text-sm text-cinza-ameixa/60">Profissional não encontrada.</p>

  return (
    <div>
      <button
        onClick={() => navigate('/profissionais')}
        className="flex items-center gap-1 text-sm text-cinza-ameixa/60 mb-3"
      >
        <ArrowLeft size={16} />
        Profissionais
      </button>

      <Card className="mb-5">
        <h1 className="font-heading text-xl font-bold text-rosa-antigo">{profissional.nome}</h1>
        <p className="text-sm text-cinza-ameixa/70">
          {profissional.telefone} · Comissão {profissional.comissaoPadrao}%
        </p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {[
          { label: 'Hoje', valor: resumo.hoje },
          { label: 'Semana', valor: resumo.semana },
          { label: 'Mês', valor: resumo.mes },
          { label: 'A Receber', valor: resumo.aReceber, tone: 'coral-suave' },
          { label: 'Pago', valor: resumo.pago, tone: 'verde-salvia' },
        ].map((item) => (
          <Card key={item.label} className="p-3">
            <p className="text-[11px] uppercase text-cinza-ameixa/50 mb-1">{item.label}</p>
            <p className="text-sm font-bold">{formatMoney(item.valor)}</p>
          </Card>
        ))}
      </div>

      <Button
        fullWidth
        className="mb-6"
        onClick={() => navigate(`/fechamentos?profissionalId=${profissional.id}`)}
      >
        <Wallet size={16} />
        Ir para Fechamento
      </Button>

      <h2 className="font-heading text-lg font-bold mb-3">Atendimentos</h2>
      {atendimentos.length === 0 ? (
        <Card className="text-sm text-cinza-ameixa/60">Nenhum atendimento registrado.</Card>
      ) : (
        <div className="space-y-2">
          {[...atendimentos]
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((a) => (
              <Card key={a.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{nomeCliente(a.clienteId)}</p>
                  <p className="text-xs text-cinza-ameixa/60">
                    {formatDate(a.data)} · {nomeServico(a.servicoId)} ·{' '}
                    {a.tipo === 'pacote' ? 'Pacote' : 'Avulso'}
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
    </div>
  )
}
