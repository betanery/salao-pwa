import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Field'
import { NovoAgendamentoModal } from '../components/NovoAgendamentoModal'
import { AgendamentoDetalheModal } from '../components/AgendamentoDetalheModal'
import { gerarHorarios, addDaysISO, weekDayLabel, dayMonthLabel } from '../lib/horarios'
import { todayISO } from '../lib/format'
import type { Agendamento } from '../types'
import clsx from 'clsx'

type Visao = 'dia' | 'semana'

const slots = gerarHorarios()

export function Agenda() {
  const [visao, setVisao] = useState<Visao>('dia')
  const [dataSelecionada, setDataSelecionada] = useState(todayISO())
  const [profissionalFiltro, setProfissionalFiltro] = useState('todas')
  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)
  const [novoSlot, setNovoSlot] = useState<{ horario: string; profissionalId: string } | null>(null)

  const agendamentos = useStore((s) => s.agendamentos)
  const profissionais = useStore((s) => s.profissionais).filter((p) => p.ativo)
  const clientes = useStore((s) => s.clientes)
  const servicos = useStore((s) => s.servicos)

  const colunas = profissionalFiltro === 'todas' ? profissionais : profissionais.filter((p) => p.id === profissionalFiltro)

  const agendaDoDia = (data: string) =>
    agendamentos.filter((a) => a.data === data && a.status !== 'cancelado')

  const semanaDatas = useMemo(() => {
    const inicio = addDaysISO(dataSelecionada, -((new Date(`${dataSelecionada}T00:00:00`).getDay() + 6) % 7))
    return Array.from({ length: 7 }, (_, i) => addDaysISO(inicio, i))
  }, [dataSelecionada])

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-rosa-antigo">Agenda</h1>
        <Button onClick={() => setNovoSlot({ horario: '09:00', profissionalId: colunas[0]?.id ?? '' })}>
          <Plus size={16} />
          Novo
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-xl overflow-hidden border border-lilas-suave">
          {(['dia', 'semana'] as Visao[]).map((v) => (
            <button
              key={v}
              onClick={() => setVisao(v)}
              className={clsx(
                'px-3 py-2 text-sm font-semibold capitalize',
                visao === v ? 'bg-rosa-quartzo text-cinza-ameixa' : 'bg-white text-cinza-ameixa/60'
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={() => setDataSelecionada(todayISO())}
          className="px-3 py-2 text-sm font-semibold rounded-xl border border-lilas-suave text-cinza-ameixa/70 hover:bg-pessego-claro"
        >
          Hoje
        </button>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="rounded-xl border border-lilas-suave px-3 py-2 text-sm"
        />
        <Select
          value={profissionalFiltro}
          onChange={(e) => setProfissionalFiltro(e.target.value)}
          className="w-auto"
        >
          <option value="todas">Todas as profissionais</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </Select>
      </div>

      {visao === 'semana' ? (
        <div className="grid grid-cols-7 gap-2">
          {semanaDatas.map((data) => {
            const eventos = agendaDoDia(data).filter(
              (a) => profissionalFiltro === 'todas' || a.profissionalId === profissionalFiltro
            )
            return (
              <Card
                key={data}
                onClick={() => {
                  setDataSelecionada(data)
                  setVisao('dia')
                }}
                className={clsx(
                  'cursor-pointer text-center p-2',
                  data === todayISO() && 'ring-2 ring-rosa-quartzo'
                )}
              >
                <p className="text-[11px] uppercase text-cinza-ameixa/50">{weekDayLabel(data)}</p>
                <p className="text-sm font-bold">{dayMonthLabel(data)}</p>
                <p className="mt-1 text-xs font-semibold text-rosa-antigo">{eventos.length} atend.</p>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <div
            className="grid gap-px bg-lilas-suave/40 rounded-2xl overflow-hidden border border-lilas-suave/40 min-w-[480px]"
            style={{ gridTemplateColumns: `72px repeat(${colunas.length || 1}, minmax(140px, 1fr))` }}
          >
            <div className="bg-white/80 p-2" />
            {colunas.map((p) => (
              <div key={p.id} className="bg-white/80 p-2 text-xs font-semibold text-center text-rosa-antigo">
                {p.nome}
              </div>
            ))}

            {slots.map((horario) => (
              <div key={horario} className="contents">
                <div className="bg-white/60 p-2 text-[11px] text-cinza-ameixa/50 text-right">{horario}</div>
                {colunas.map((p) => {
                  const evento = agendaDoDia(dataSelecionada).find(
                    (a) => a.profissionalId === p.id && a.horario === horario
                  )
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        evento ? setSelecionado(evento) : setNovoSlot({ horario, profissionalId: p.id })
                      }
                      className={clsx(
                        'p-1.5 text-left min-h-[44px] transition-colors',
                        evento
                          ? evento.status === 'concluido'
                            ? 'bg-verde-salvia/50 hover:brightness-95'
                            : 'bg-rosa-quartzo/60 hover:brightness-95'
                          : 'bg-white/50 hover:bg-pessego-claro/50'
                      )}
                    >
                      {evento && (
                        <>
                          <p className="text-[11px] font-semibold leading-tight truncate">
                            {nomeCliente(evento.clienteId)}
                          </p>
                          <p className="text-[10px] text-cinza-ameixa/60 truncate">
                            {nomeServico(evento.servicoId)}
                          </p>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <NovoAgendamentoModal
        open={!!novoSlot}
        onClose={() => setNovoSlot(null)}
        data={dataSelecionada}
        horarioInicial={novoSlot?.horario}
        profissionalIdInicial={novoSlot?.profissionalId}
      />
      <AgendamentoDetalheModal agendamento={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  )
}
