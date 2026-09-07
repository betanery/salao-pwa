import type { Profissional, Servico, TipoComissao } from '../types'

export interface ComissaoCalculada {
  tipo: TipoComissao
  valorConfigurado: number // percentual ou valor fixo, conforme tipo
  valorRepasse: number // valor final em R$
}

export const round2 = (n: number) => Math.round(n * 100) / 100

export function calcularComissao(profissional: Profissional, servico: Servico): ComissaoCalculada {
  const excecao = profissional.comissoesServicos?.find((c) => c.servicoId === servico.id)

  if (excecao) {
    if (excecao.tipo === 'fixo') {
      return { tipo: 'fixo', valorConfigurado: excecao.valor, valorRepasse: round2(excecao.valor) }
    }
    return {
      tipo: 'percentual',
      valorConfigurado: excecao.valor,
      valorRepasse: round2((servico.preco * excecao.valor) / 100),
    }
  }

  return {
    tipo: 'percentual',
    valorConfigurado: profissional.comissaoPadrao,
    valorRepasse: round2((servico.preco * profissional.comissaoPadrao) / 100),
  }
}

export const formatComissao = (tipo: TipoComissao, valor: number) =>
  tipo === 'percentual' ? `${valor}%` : `R$ ${valor.toFixed(2).replace('.', ',')} fixo`
