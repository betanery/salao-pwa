import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Wallet, PackageCheck, Plus, Clock, ChevronRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { AgendamentoDetalheModal } from '../components/AgendamentoDetalheModal'
import { formatMoney, formatDateLong, todayISO } from '../lib/format'
import type { Agendamento } from '../types'

export function Dashboard() {
  const navigate = useNavigate()
  const hoje = todayISO()
  const agendamentos = useStore((s) => s.agendamentos)
  const clientes = useStore((s) => s.clientes)
  const profissionais = useStore((s) => s.profissionais)
  const servicos = useStore((s) => s.servicos)
  const atendimentos = useStore((s) => s.atendimentos)
  const pacotesCliente = useStore((s) => s.pacotesCliente)

  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)

  const agendaHoje = useMemo(
    () =>
      agendamentos
        .filter((a) => a.data === hoje && a.status !== 'cancelado')
        .sort((a, b) => a.horario.localeCompare(b.horario)),
    [agendamentos, hoje]
  )

  const totalAPagar = useMemo(
    () => atendimentos.filter((a) => a.statusRepasse === 'a_pagar').reduce((sum, a) => sum + a.valorRepasse, 0),
    [atendimentos]
  )

  const pacotesAtivos = pacotesCliente.filter((p) => p.status === 'ativo').length

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const nomeProfissional = (id: string) => profissionais.find((p) => p.id === id)?.nome ?? '—'
  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? '—'

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-rosa-antigo mb-1 capitalize">
        Olá! {formatDateLong(hoje)}
      </h1>
      <p className="text-sm text-cinza-ameixa/70 mb-5">Aqui está o resumo do salão hoje.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card className="bg-pessego-claro/60">
          <div className="flex items-center gap-2 text-rosa-antigo mb-2">
            <CalendarClock size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">Agendamentos Hoje</span>
          </div>
          <p className="text-2xl font-bold">{agendaHoje.length}</p>
        </Card>
        <Card className="bg-amarelo-manteiga/60">
          <div className="flex items-center gap-2 text-rosa-antigo mb-2">
            <Wallet size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">A Pagar Profissionais</span>
          </div>
          <p className="text-2xl font-bold">{formatMoney(totalAPagar)}</p>
        </Card>
        <Card className="bg-lilas-suave/40">
          <div className="flex items-center gap-2 text-rosa-antigo mb-2">
            <PackageCheck size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">Pacotes Ativos</span>
          </div>
          <p className="text-2xl font-bold">{pacotesAtivos}</p>
        </Card>
      </div>

      <Button onClick={() => navigate('/atendimento/novo')} className="mb-6" fullWidth>
        <Plus size={18} />
        Novo Atendimento Rápido
      </Button>

      <h2 className="font-heading text-lg font-bold text-cinza-ameixa mb-3">Agenda do Dia</h2>
      {agendaHoje.length === 0 ? (
        <Card className="text-sm text-cinza-ameixa/60">Nenhum agendamento para hoje.</Card>
      ) : (
        <div className="space-y-2">
          {agendaHoje.map((a) => (
            <Card
              key={a.id}
              className="flex items-center justify-between cursor-pointer hover:border-rosa-quartzo"
              onClick={() => setSelecionado(a)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-rosa-quartzo/50 px-2.5 py-1.5 text-xs font-bold text-cinza-ameixa">
                  <Clock size={14} />
                  {a.horario}
                </div>
                <div>
                  <p className="text-sm font-semibold">{nomeCliente(a.clienteId)}</p>
                  <p className="text-xs text-cinza-ameixa/60">
                    {nomeServico(a.servicoId)} · {nomeProfissional(a.profissionalId)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === 'concluido' ? (
                  <Badge tone="success">Concluído</Badge>
                ) : (
                  <Badge tone="pending">Agendado</Badge>
                )}
                <ChevronRight size={18} className="text-cinza-ameixa/40" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <AgendamentoDetalheModal agendamento={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  )
}
