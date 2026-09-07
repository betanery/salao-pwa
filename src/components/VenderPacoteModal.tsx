import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { FieldGroup, Select, Input } from './ui/Field'
import { formatMoney } from '../lib/format'

export function VenderPacoteModal({
  open,
  onClose,
  clienteId,
}: {
  open: boolean
  onClose: () => void
  clienteId: string
}) {
  const pacoteModelos = useStore((s) => s.pacoteModelos).filter((p) => p.ativo)
  const venderPacote = useStore((s) => s.venderPacote)
  const [pacoteModeloId, setPacoteModeloId] = useState('')
  const [precoPago, setPrecoPago] = useState('')

  const modeloSelecionado = pacoteModelos.find((p) => p.id === pacoteModeloId)

  useEffect(() => {
    if (open) {
      setPacoteModeloId('')
      setPrecoPago('')
    }
  }, [open])

  useEffect(() => {
    if (modeloSelecionado) setPrecoPago(String(modeloSelecionado.preco))
  }, [modeloSelecionado])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacoteModeloId) return
    venderPacote(clienteId, pacoteModeloId, Number(precoPago))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Vender Pacote">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup label="Pacote">
          <Select required value={pacoteModeloId} onChange={(e) => setPacoteModeloId(e.target.value)}>
            <option value="">Selecione o pacote</option>
            {pacoteModelos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {formatMoney(p.preco)}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="Valor cobrado">
          <Input
            type="number"
            min={0}
            step="0.01"
            required
            value={precoPago}
            onChange={(e) => setPrecoPago(e.target.value)}
          />
        </FieldGroup>
        <Button type="submit" fullWidth disabled={!pacoteModeloId}>
          Confirmar Venda
        </Button>
      </form>
    </Modal>
  )
}
