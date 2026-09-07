export type Papel = 'admin' | 'profissional'

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  papel: Papel
  profissionalId?: string
}

export type TipoComissao = 'percentual' | 'fixo'

export interface ComissaoServico {
  servicoId: string
  tipo: TipoComissao
  valor: number // percentual (0-100) se tipo "percentual", ou valor em R$ se "fixo"
}

export interface Profissional {
  id: string
  nome: string
  telefone: string
  email: string
  comissaoPadrao: number // percentual padrão, ex: 40 — usado quando não há exceção por serviço
  comissoesServicos?: ComissaoServico[] // exceções de comissão por serviço
  ativo: boolean
}

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  criadoEm: string
}

export interface Servico {
  id: string
  nome: string
  categoria: string
  duracaoMin: number
  preco: number
  ativo: boolean
}

export interface PacoteItem {
  servicoId: string
  quantidade: number
}

export interface PacoteModelo {
  id: string
  nome: string
  itens: PacoteItem[]
  preco: number
  ativo: boolean
}

export interface PacoteClienteItem extends PacoteItem {
  utilizado: number
}

export type StatusPacote = 'ativo' | 'finalizado'

export interface PacoteCliente {
  id: string
  clienteId: string
  pacoteModeloId: string
  nome: string
  itens: PacoteClienteItem[]
  precoPago: number
  dataVenda: string
  status: StatusPacote
}

export type StatusAgendamento = 'agendado' | 'concluido' | 'cancelado'

export interface Agendamento {
  id: string
  clienteId: string
  profissionalId: string
  servicoId: string
  data: string // yyyy-MM-dd
  horario: string // HH:mm
  duracaoMin: number
  status: StatusAgendamento
  observacao?: string
}

export type TipoAtendimento = 'avulso' | 'pacote'
export type StatusRepasse = 'a_pagar' | 'pago'

export interface Atendimento {
  id: string
  data: string // yyyy-MM-dd
  clienteId: string
  profissionalId: string
  servicoId: string
  tipo: TipoAtendimento
  pacoteClienteId?: string
  valor: number
  comissaoTipo: TipoComissao
  comissaoValor: number // percentual (0-100) ou valor fixo em R$, conforme comissaoTipo
  valorRepasse: number
  statusRepasse: StatusRepasse
  fechamentoId?: string
  agendamentoId?: string
}

export interface Pagamento {
  id: string
  data: string
  valor: number
  forma: string
  observacao?: string
}

export interface Fechamento {
  id: string
  profissionalId: string
  periodoInicio: string
  periodoFim: string
  atendimentoIds: string[]
  pagamentos: Pagamento[]
  criadoEm: string
}
