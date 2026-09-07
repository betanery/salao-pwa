import { useState } from 'react'
import { useStore } from '../lib/store'
import type { Profissional } from '../types'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { FieldGroup, Select, Input } from './ui/Field'
import { todayISO } from '../lib/format'

const formasPagamento = ['Pix', 'Dinheiro', 'Cartão', 'Transferência']

export function RegistrarAluguelModal({
  open,
  onClose,
  profissional,
}: {
  open: boolean
  onClose: () => void
  profissional: Profissional
}) {
  const registrarPagamentoAluguel = useStore((s) => s.registrarPagamentoAluguel)
  const [data, setData] = useState(todayISO())
  const [valor, setValor] = useState(String(profissional.aluguelValor))
  const [forma, setForma] = useState(formasPagamento[0])
  const [observacao, setObservacao] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registrarPagamentoAluguel(profissional.id, {
      data,
      valor: Number(valor),
      forma,
      observacao: observacao || undefined,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar Pagamento do Aluguel">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup label="Data do pagamento">
          <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Valor">
          <Input
            type="number"
            min={0}
            step="0.01"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup label="Forma de pagamento">
          <Select value={forma} onChange={(e) => setForma(e.target.value)}>
            {formasPagamento.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="Observação (opcional)">
          <Input value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: referente à 1ª quinzena de setembro" />
        </FieldGroup>
        <Button type="submit" fullWidth>
          Confirmar Pagamento
        </Button>
      </form>
    </Modal>
  )
}
