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
  const cancelarAgendamento = useStore((s) => s.cancelarAgendamento)

  return (
    <Modal open={!!agendamento} onClose={onClose} title="Detalhes do Agendamento">
      {agendamento && (
        <div className="space-y-4">
          <p className="text-sm text-cinza-ameixa/60">
            Agendado para {agendamento.data.split('-').reverse().join('/')}. Ajuste os dados abaixo se algo
            mudou antes de confirmar.
          </p>

          {agendamento.status === 'concluido' ? (
            <Badge tone="success">Atendimento já concluído</Badge>
          ) : agendamento.status === 'cancelado' ? (
            <Badge tone="pending">Agendamento cancelado</Badge>
          ) : (
            <>
              <AtendimentoForm agendamento={agendamento} onDone={onClose} />
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
