import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import type { Agendamento, TipoAtendimento } from '../types'
import { Button } from './ui/Button'
import { FieldGroup, Select, Input } from './ui/Field'
import { formatMoney } from '../lib/format'
import { calcularComissao, formatComissao } from '../lib/comissao'
import { valorUnitarioPacote } from '../lib/pacote'

interface Props {
  agendamento?: Agendamento
  clienteIdInicial?: string
  onDone?: () => void
}

export function AtendimentoForm({ agendamento, clienteIdInicial, onDone }: Props) {
  const clientes = useStore((s) => s.clientes)
  const profissionais = useStore((s) => s.profissionais).filter((p) => p.ativo)
  const servicos = useStore((s) => s.servicos).filter((sv) => sv.ativo)
  const pacotesCliente = useStore((s) => s.pacotesCliente)
  const confirmarAtendimento = useStore((s) => s.confirmarAtendimento)
  const updateAgendamento = useStore((s) => s.updateAgendamento)

  const [clienteId, setClienteId] = useState(agendamento?.clienteId ?? clienteIdInicial ?? '')
  const [servicoId, setServicoId] = useState(agendamento?.servicoId ?? '')
  const [profissionalId, setProfissionalId] = useState(agendamento?.profissionalId ?? '')
  const [horario, setHorario] = useState(agendamento?.horario ?? '')
  const [tipo, setTipo] = useState<TipoAtendimento>('avulso')
  const [pacoteClienteId, setPacoteClienteId] = useState('')
  const [concluido, setConcluido] = useState(false)

  const pacotesDisponiveis = useMemo(
    () =>
      pacotesCliente.filter((pc) => {
        if (pc.clienteId !== clienteId || pc.status !== 'ativo') return false
        return pc.itens.some((i) => i.servicoId === servicoId && i.utilizado < i.quantidade)
      }),
    [pacotesCliente, clienteId, servicoId]
  )

  const servico = servicos.find((s) => s.id === servicoId)
  const profissional = profissionais.find((p) => p.id === profissionalId)
  const pacoteSelecionado = pacotesDisponiveis.find((pc) => pc.id === pacoteClienteId)

  const precoReferencia =
    tipo === 'pacote' && pacoteSelecionado && servico
      ? valorUnitarioPacote(pacoteSelecionado, servico.id, servicos)
      : servico?.preco

  const comissao =
    servico && profissional && precoReferencia !== undefined
      ? calcularComissao(profissional, servico, precoReferencia)
      : null

  const salvarAlteracoesAgendamento = () => {
    if (!agendamento) return
    updateAgendamento(agendamento.id, {
      clienteId,
      servicoId,
      profissionalId,
      horario: horario || agendamento.horario,
      duracaoMin: servico?.duracaoMin ?? agendamento.duracaoMin,
    })
  }

  const handleSalvarAlteracoes = () => {
    if (!clienteId || !servicoId || !profissionalId || !horario) return
    salvarAlteracoesAgendamento()
    onDone?.()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteId || !servicoId || !profissionalId) return

    salvarAlteracoesAgendamento()

    confirmarAtendimento({
      clienteId,
      servicoId,
      profissionalId,
      tipo,
      pacoteClienteId: tipo === 'pacote' ? pacoteClienteId : undefined,
      agendamentoId: agendamento?.id,
    })
    setConcluido(true)
    onDone?.()
  }

  if (concluido) {
    return (
      <div className="rounded-2xl bg-verde-salvia/50 p-4 text-sm text-cinza-ameixa font-medium">
        Atendimento confirmado! {servico && `${servico.nome} lançado com sucesso.`}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup label="Cliente">
        <Select required value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Selecione a cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup label="Serviço">
        <Select required value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
          <option value="">Selecione o serviço</option>
          {servicos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome} — {formatMoney(s.preco)}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup label="Profissional">
        <Select required value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)}>
          <option value="">Selecione a profissional</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </Select>
      </FieldGroup>

      {agendamento && (
        <FieldGroup label="Horário">
          <Input type="time" required value={horario} onChange={(e) => setHorario(e.target.value)} />
        </FieldGroup>
      )}

      <FieldGroup label="Tipo de atendimento">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipo('avulso')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border ${
              tipo === 'avulso'
                ? 'bg-rosa-quartzo border-rosa-quartzo text-cinza-ameixa'
                : 'border-lilas-suave text-cinza-ameixa/70'
            }`}
          >
            Avulso
          </button>
          <button
            type="button"
            disabled={pacotesDisponiveis.length === 0}
            onClick={() => setTipo('pacote')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border disabled:opacity-40 ${
              tipo === 'pacote'
                ? 'bg-rosa-quartzo border-rosa-quartzo text-cinza-ameixa'
                : 'border-lilas-suave text-cinza-ameixa/70'
            }`}
          >
            Pacote
          </button>
        </div>
        {clienteId && servicoId && pacotesDisponiveis.length === 0 && (
          <p className="text-xs text-cinza-ameixa/50 mt-1">
            Esta cliente não tem pacote ativo com saldo para este serviço.
          </p>
        )}
      </FieldGroup>

      {tipo === 'pacote' && (
        <FieldGroup label="Pacote a consumir">
          <Select required value={pacoteClienteId} onChange={(e) => setPacoteClienteId(e.target.value)}>
            <option value="">Selecione o pacote</option>
            {pacotesDisponiveis.map((pc) => {
              const item = pc.itens.find((i) => i.servicoId === servicoId)
              return (
                <option key={pc.id} value={pc.id}>
                  {pc.nome} (saldo: {item ? item.quantidade - item.utilizado : 0})
                </option>
              )
            })}
          </Select>
        </FieldGroup>
      )}

      {servico && (
        <p className="text-sm text-cinza-ameixa/70">
          Valor de tabela do serviço:{' '}
          <span className="font-semibold text-cinza-ameixa">{formatMoney(servico.preco)}</span>
        </p>
      )}

      {tipo === 'pacote' && pacoteSelecionado && precoReferencia !== undefined && (
        <p className="text-sm text-cinza-ameixa/70">
          Valor unitário neste pacote:{' '}
          <span className="font-semibold text-cinza-ameixa">{formatMoney(precoReferencia)}</span>
        </p>
      )}

      {comissao && (
        <p className="text-sm text-cinza-ameixa/70">
          Repasse ({formatComissao(comissao.tipo, comissao.valorConfigurado)}):{' '}
          <span className="font-semibold text-cinza-ameixa">{formatMoney(comissao.valorRepasse)}</span>
        </p>
      )}

      {agendamento && (
        <Button type="button" variant="secondary" fullWidth onClick={handleSalvarAlteracoes}>
          Salvar Alterações
        </Button>
      )}

      <Button type="submit" fullWidth>
        Confirmar Atendimento
      </Button>
    </form>
  )
}
