import type { PacoteCliente, Servico } from '../types'
import { round2 } from './comissao'

/**
 * Preço unitário efetivo de um serviço dentro de um pacote já vendido.
 * Rateia o preço pago do pacote entre os serviços que o compõem,
 * proporcionalmente ao preço de tabela de cada um — assim um pacote misto
 * (ex.: manicure + pedicure) distribui o desconto de forma justa entre eles.
 * Cai para o preço de tabela se o pacote não tiver dados suficientes.
 */
export function valorUnitarioPacote(
  pacoteCliente: PacoteCliente,
  servicoId: string,
  servicos: Servico[]
): number {
  const item = pacoteCliente.itens.find((i) => i.servicoId === servicoId)
  const servico = servicos.find((s) => s.id === servicoId)
  if (!item || !servico) return servico?.preco ?? 0

  const totalTabela = pacoteCliente.itens.reduce((sum, i) => {
    const s = servicos.find((sv) => sv.id === i.servicoId)
    return sum + (s ? s.preco * i.quantidade : 0)
  }, 0)
  if (totalTabela === 0) return servico.preco

  const proporcao = (servico.preco * item.quantidade) / totalTabela
  return round2((pacoteCliente.precoPago * proporcao) / item.quantidade)
}
