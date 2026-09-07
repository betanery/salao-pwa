import { Ban } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Agendamento } from '../types'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { AtendimentoForm } from './AtendimentoForm'

export function AgendamentoDetalheModal({
  agendamento,
  onClose,
}: {
  agendamento: Agendamento | null
  onClose: () => void
}) {
  const clientes = useStore((s) => s.clientes)
  const profissionais = useStore((s) => s.profissionais)
  const servicos = useStore((s) => s.servicos)
  const cancelarAgendamento = useStore((s) => s.cancelarAgendamento)

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const nomeProfissional = (id: string) => profissionais.find((p) => p.id === id)?.nome ?? '—'
  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? '—'

  return (
    <Modal open={!!agendamento} onClose={onClose} title="Detalhes do Agendamento">
      {agendamento && (
        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-cinza-ameixa/60">Cliente: </span>
              <span className="font-semibold">{nomeCliente(agendamento.clienteId)}</span>
            </p>
            <p>
              <span className="text-cinza-ameixa/60">Serviço: </span>
              <span className="font-semibold">{nomeServico(agendamento.servicoId)}</span>
            </p>
            <p>
              <span className="text-cinza-ameixa/60">Profissional: </span>
              <span className="font-semibold">{nomeProfissional(agendamento.profissionalId)}</span>
            </p>
            <p>
              <span className="text-cinza-ameixa/60">Data / Horário: </span>
              <span className="font-semibold">
                {agendamento.data.split('-').reverse().join('/')} às {agendamento.horario}
              </span>
            </p>
          </div>

          {agendamento.status === 'concluido' ? (
            <Badge tone="success">Atendimento já concluído</Badge>
          ) : agendamento.status === 'cancelado' ? (
            <Badge tone="pending">Agendamento cancelado</Badge>
          ) : (
            <>
              <AtendimentoForm agendamento={agendamento} onConcluido={onClose} />
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  cancelarAgendamento(agendamento.id)
                  onClose()
                }}
              >
                <Ban size={16} />
                Cancelar agendamento
              </Button>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
