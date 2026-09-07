import { useSearchParams } from 'react-router-dom'
import { AtendimentoForm } from '../components/AtendimentoForm'
import { Card } from '../components/ui/Card'

export function AtendimentoNovo() {
  const [params] = useSearchParams()
  const clienteIdInicial = params.get('clienteId') ?? undefined

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl font-bold text-rosa-antigo mb-1">Novo Atendimento</h1>
      <p className="text-sm text-cinza-ameixa/70 mb-5">
        Registre um atendimento avulso ou baixa de pacote.
      </p>
      <Card>
        <AtendimentoForm clienteIdInicial={clienteIdInicial} />
      </Card>
    </div>
  )
}
