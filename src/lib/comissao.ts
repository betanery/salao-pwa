import type { Profissional, Servico, TipoComissao } from '../types'

export interface ComissaoCalculada {
  tipo: TipoComissao
  valorConfigurado: number // percentual ou valor fixo, conforme tipo
  valorRepasse: number // valor final em R$
}

export const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * `precoReferencia` é a base sobre a qual a comissão percentual incide —
 * o preço de tabela do serviço por padrão, ou o preço unitário real
 * (rateado) quando o atendimento vem de um pacote com desconto. Uma
 * exceção de comissão "fixo" ignora essa base: é sempre o mesmo valor
 * por atendimento, pacote ou avulso.
 */
export function calcularComissao(
  profissional: Profissional,
  servico: Servico,
  precoReferencia: number = servico.preco
): ComissaoCalculada {
  const excecao = profissional.comissoesServicos?.find((c) => c.servicoId === servico.id)

  if (excecao) {
    if (excecao.tipo === 'fixo') {
      return { tipo: 'fixo', valorConfigurado: excecao.valor, valorRepasse: round2(excecao.valor) }
    }
    return {
      tipo: 'percentual',
      valorConfigurado: excecao.valor,
      valorRepasse: round2((precoReferencia * excecao.valor) / 100),
    }
  }

  return {
    tipo: 'percentual',
    valorConfigurado: profissional.comissaoPadrao,
    valorRepasse: round2((precoReferencia * profissional.comissaoPadrao) / 100),
  }
}

export const formatComissao = (tipo: TipoComissao, valor: number) =>
  tipo === 'percentual' ? `${valor}%` : `R$ ${valor.toFixed(2).replace('.', ',')} fixo`
