import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Package, ArrowLeft } from 'lucide-react'
import { useStore } from '../lib/store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { VenderPacoteModal } from '../components/VenderPacoteModal'
import { formatDate, formatMoney } from '../lib/format'

export function ClienteFicha() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cliente = useStore((s) => s.clientes.find((c) => c.id === id))
  const pacotesCliente = useStore((s) => s.pacotesCliente).filter((p) => p.clienteId === id)
  const atendimentos = useStore((s) => s.atendimentos).filter((a) => a.clienteId === id)
  const servicos = useStore((s) => s.servicos)
  const profissionais = useStore((s) => s.profissionais)
  const [venderOpen, setVenderOpen] = useState(false)

  const nomeServico = (sid: string) => servicos.find((s) => s.id === sid)?.nome ?? '—'
  const nomeProfissional = (pid: string) => profissionais.find((p) => p.id === pid)?.nome ?? '—'

  if (!cliente) {
    return <p className="text-sm text-cinza-ameixa/60">Cliente não encontrada.</p>
  }

  return (
    <div>
      <button
        onClick={() => navigate('/clientes')}
        className="flex items-center gap-1 text-sm text-cinza-ameixa/60 mb-3"
      >
        <ArrowLeft size={16} />
        Clientes
      </button>

      <Card className="mb-5">
        <h1 className="font-heading text-xl font-bold text-rosa-antigo">{cliente.nome}</h1>
        <p className="text-sm text-cinza-ameixa/70">{cliente.telefone}</p>
        {cliente.email && <p className="text-sm text-cinza-ameixa/70">{cliente.email}</p>}
        <p className="text-xs text-cinza-ameixa/40 mt-1">Cliente desde {formatDate(cliente.criadoEm)}</p>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="secondary" onClick={() => setVenderOpen(true)} className="flex-1">
          <Package size={16} />
          Vender Pacote
        </Button>
        <Button onClick={() => navigate(`/atendimento/novo?clienteId=${cliente.id}`)} className="flex-1">
          <Plus size={16} />
          Novo Atendimento
        </Button>
      </div>

      <h2 className="font-heading text-lg font-bold mb-3">Pacotes Ativos</h2>
      {pacotesCliente.length === 0 ? (
        <Card className="text-sm text-cinza-ameixa/60 mb-6">Nenhum pacote registrado.</Card>
      ) : (
        <div className="space-y-2 mb-6">
          {pacotesCliente.map((pc) => (
            <Card key={pc.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{pc.nome}</p>
                <Badge tone={pc.status === 'ativo' ? 'success' : 'neutral'}>
                  {pc.status === 'ativo' ? 'Ativo' : 'Finalizado'}
                </Badge>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-cinza-ameixa/50 text-left">
                    <th className="font-medium pb-1">Serviço</th>
                    <th className="font-medium pb-1 text-center">Contratado</th>
                    <th className="font-medium pb-1 text-center">Utilizado</th>
                    <th className="font-medium pb-1 text-center">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {pc.itens.map((item) => (
                    <tr key={item.servicoId} className="border-t border-lilas-suave/40">
                      <td className="py-1.5">{nomeServico(item.servicoId)}</td>
                      <td className="py-1.5 text-center">{item.quantidade}</td>
                      <td className="py-1.5 text-center">{item.utilizado}</td>
                      <td className="py-1.5 text-center font-semibold">{item.quantidade - item.utilizado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      )}

      <h2 className="font-heading text-lg font-bold mb-3">Histórico de Atendimentos</h2>
      {atendimentos.length === 0 ? (
        <Card className="text-sm text-cinza-ameixa/60">Nenhum atendimento registrado.</Card>
      ) : (
        <div className="space-y-2">
          {[...atendimentos]
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((a) => (
              <Card key={a.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{nomeServico(a.servicoId)}</p>
                  <p className="text-xs text-cinza-ameixa/60">
                    {formatDate(a.data)} · {nomeProfissional(a.profissionalId)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatMoney(a.valor)}</p>
                  <Badge tone={a.tipo === 'pacote' ? 'info' : 'neutral'}>
                    {a.tipo === 'pacote' ? 'Pacote' : 'Avulso'}
                  </Badge>
                </div>
              </Card>
            ))}
        </div>
      )}

      <VenderPacoteModal open={venderOpen} onClose={() => setVenderOpen(false)} clienteId={cliente.id} />
    </div>
  )
}
