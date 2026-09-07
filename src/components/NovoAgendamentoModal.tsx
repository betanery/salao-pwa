import { useState, useEffect } from 'react'
import { useStore } from '../lib/store'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { FieldGroup, Select, Input } from './ui/Field'

interface Props {
  open: boolean
  onClose: () => void
  data: string
  horarioInicial?: string
  profissionalIdInicial?: string
}

export function NovoAgendamentoModal({ open, onClose, data, horarioInicial, profissionalIdInicial }: Props) {
  const clientes = useStore((s) => s.clientes)
  const profissionais = useStore((s) => s.profissionais).filter((p) => p.ativo)
  const servicos = useStore((s) => s.servicos).filter((sv) => sv.ativo)
  const addAgendamento = useStore((s) => s.addAgendamento)

  const [clienteId, setClienteId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [profissionalId, setProfissionalId] = useState(profissionalIdInicial ?? '')
  const [horario, setHorario] = useState(horarioInicial ?? '09:00')

  useEffect(() => {
    if (open) {
      setProfissionalId(profissionalIdInicial ?? '')
      setHorario(horarioInicial ?? '09:00')
      setClienteId('')
      setServicoId('')
    }
  }, [open, profissionalIdInicial, horarioInicial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const servico = servicos.find((s) => s.id === servicoId)
    if (!clienteId || !servicoId || !profissionalId || !servico) return
    addAgendamento({
      clienteId,
      servicoId,
      profissionalId,
      data,
      horario,
      duracaoMin: servico.duracaoMin,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Agendamento">
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
                {s.nome} ({s.duracaoMin} min)
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
        <FieldGroup label="Horário">
          <Input type="time" required value={horario} onChange={(e) => setHorario(e.target.value)} />
        </FieldGroup>
        <Button type="submit" fullWidth>
          Agendar
        </Button>
      </form>
    </Modal>
  )
}
