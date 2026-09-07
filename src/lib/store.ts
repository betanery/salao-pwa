import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Agendamento,
  Atendimento,
  Cliente,
  Fechamento,
  PacoteCliente,
  PacoteModelo,
  Pagamento,
  Profissional,
  Servico,
  StatusAgendamento,
  TipoAtendimento,
  Usuario,
} from '../types'
import {
  seedAgendamentos,
  seedClientes,
  seedPacoteModelos,
  seedPacotesCliente,
  seedProfissionais,
  seedServicos,
  seedUsuarios,
} from './seed'
import { todayISO, uid } from './format'

interface SalaoState {
  usuarios: Usuario[]
  currentUserId: string | null
  clientes: Cliente[]
  profissionais: Profissional[]
  servicos: Servico[]
  pacoteModelos: PacoteModelo[]
  pacotesCliente: PacoteCliente[]
  agendamentos: Agendamento[]
  atendimentos: Atendimento[]
  fechamentos: Fechamento[]

  login: (email: string, senha: string) => Usuario | null
  logout: () => void

  addCliente: (data: Omit<Cliente, 'id' | 'criadoEm'>) => Cliente
  updateCliente: (id: string, data: Partial<Cliente>) => void

  addProfissional: (data: Omit<Profissional, 'id'>) => Profissional
  updateProfissional: (id: string, data: Partial<Profissional>) => void

  addServico: (data: Omit<Servico, 'id'>) => Servico
  updateServico: (id: string, data: Partial<Servico>) => void

  addPacoteModelo: (data: Omit<PacoteModelo, 'id'>) => PacoteModelo
  updatePacoteModelo: (id: string, data: Partial<PacoteModelo>) => void

  venderPacote: (clienteId: string, pacoteModeloId: string, precoPago?: number) => PacoteCliente

  addAgendamento: (data: Omit<Agendamento, 'id' | 'status'>) => Agendamento
  updateAgendamento: (id: string, data: Partial<Agendamento>) => void
  cancelarAgendamento: (id: string) => void

  confirmarAtendimento: (input: {
    clienteId: string
    servicoId: string
    profissionalId: string
    tipo: TipoAtendimento
    pacoteClienteId?: string
    agendamentoId?: string
    data?: string
  }) => Atendimento

  registrarPagamento: (
    profissionalId: string,
    atendimentoIds: string[],
    periodoInicio: string,
    periodoFim: string,
    pagamento: Omit<Pagamento, 'id'>
  ) => Fechamento
}

export const useStore = create<SalaoState>()(
  persist(
    (set, get) => ({
      usuarios: seedUsuarios,
      currentUserId: null,
      clientes: seedClientes,
      profissionais: seedProfissionais,
      servicos: seedServicos,
      pacoteModelos: seedPacoteModelos,
      pacotesCliente: seedPacotesCliente,
      agendamentos: seedAgendamentos,
      atendimentos: [],
      fechamentos: [],

      login: (email, senha) => {
        const user = get().usuarios.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
        )
        if (user) set({ currentUserId: user.id })
        return user ?? null
      },
      logout: () => set({ currentUserId: null }),

      addCliente: (data) => {
        const cliente: Cliente = { ...data, id: uid(), criadoEm: todayISO() }
        set((s) => ({ clientes: [...s.clientes, cliente] }))
        return cliente
      },
      updateCliente: (id, data) =>
        set((s) => ({ clientes: s.clientes.map((c) => (c.id === id ? { ...c, ...data } : c)) })),

      addProfissional: (data) => {
        const profissional: Profissional = { ...data, id: uid() }
        set((s) => ({ profissionais: [...s.profissionais, profissional] }))
        return profissional
      },
      updateProfissional: (id, data) =>
        set((s) => ({
          profissionais: s.profissionais.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      addServico: (data) => {
        const servico: Servico = { ...data, id: uid() }
        set((s) => ({ servicos: [...s.servicos, servico] }))
        return servico
      },
      updateServico: (id, data) =>
        set((s) => ({ servicos: s.servicos.map((sv) => (sv.id === id ? { ...sv, ...data } : sv)) })),

      addPacoteModelo: (data) => {
        const pacote: PacoteModelo = { ...data, id: uid() }
        set((s) => ({ pacoteModelos: [...s.pacoteModelos, pacote] }))
        return pacote
      },
      updatePacoteModelo: (id, data) =>
        set((s) => ({
          pacoteModelos: s.pacoteModelos.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      venderPacote: (clienteId, pacoteModeloId, precoPago) => {
        const modelo = get().pacoteModelos.find((p) => p.id === pacoteModeloId)
        if (!modelo) throw new Error('Pacote não encontrado')
        const pacoteCliente: PacoteCliente = {
          id: uid(),
          clienteId,
          pacoteModeloId,
          nome: modelo.nome,
          itens: modelo.itens.map((i) => ({ ...i, utilizado: 0 })),
          precoPago: precoPago ?? modelo.preco,
          dataVenda: todayISO(),
          status: 'ativo',
        }
        set((s) => ({ pacotesCliente: [...s.pacotesCliente, pacoteCliente] }))
        return pacoteCliente
      },

      addAgendamento: (data) => {
        const agendamento: Agendamento = { ...data, id: uid(), status: 'agendado' as StatusAgendamento }
        set((s) => ({ agendamentos: [...s.agendamentos, agendamento] }))
        return agendamento
      },
      updateAgendamento: (id, data) =>
        set((s) => ({
          agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      cancelarAgendamento: (id) =>
        set((s) => ({
          agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a)),
        })),

      confirmarAtendimento: ({ clienteId, servicoId, profissionalId, tipo, pacoteClienteId, agendamentoId, data }) => {
        const servico = get().servicos.find((s) => s.id === servicoId)
        const profissional = get().profissionais.find((p) => p.id === profissionalId)
        if (!servico || !profissional) throw new Error('Serviço ou profissional inválido')

        if (tipo === 'pacote' && pacoteClienteId) {
          set((s) => ({
            pacotesCliente: s.pacotesCliente.map((pc) => {
              if (pc.id !== pacoteClienteId) return pc
              const itens = pc.itens.map((item) =>
                item.servicoId === servicoId ? { ...item, utilizado: item.utilizado + 1 } : item
              )
              const finalizado = itens.every((i) => i.utilizado >= i.quantidade)
              return { ...pc, itens, status: finalizado ? 'finalizado' : 'ativo' }
            }),
          }))
        }

        const atendimento: Atendimento = {
          id: uid(),
          data: data ?? todayISO(),
          clienteId,
          profissionalId,
          servicoId,
          tipo,
          pacoteClienteId,
          valor: servico.preco,
          comissaoPercentual: profissional.comissaoPadrao,
          valorRepasse: Math.round(servico.preco * (profissional.comissaoPadrao / 100) * 100) / 100,
          statusRepasse: 'a_pagar',
          agendamentoId,
        }
        set((s) => ({ atendimentos: [...s.atendimentos, atendimento] }))

        if (agendamentoId) {
          set((s) => ({
            agendamentos: s.agendamentos.map((a) =>
              a.id === agendamentoId ? { ...a, status: 'concluido' } : a
            ),
          }))
        }

        return atendimento
      },

      registrarPagamento: (profissionalId, atendimentoIds, periodoInicio, periodoFim, pagamento) => {
        const fechamento: Fechamento = {
          id: uid(),
          profissionalId,
          periodoInicio,
          periodoFim,
          atendimentoIds,
          pagamentos: [{ ...pagamento, id: uid() }],
          criadoEm: todayISO(),
        }
        set((s) => ({
          fechamentos: [...s.fechamentos, fechamento],
          atendimentos: s.atendimentos.map((a) =>
            atendimentoIds.includes(a.id) ? { ...a, statusRepasse: 'pago', fechamentoId: fechamento.id } : a
          ),
        }))
        return fechamento
      },
    }),
    { name: 'salao-pwa-storage' }
  )
)

export const useCurrentUser = () =>
  useStore((s) => s.usuarios.find((u) => u.id === s.currentUserId) ?? null)
