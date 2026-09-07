import type {
  Agendamento,
  Cliente,
  PacoteCliente,
  PacoteModelo,
  Profissional,
  Servico,
  Usuario,
} from '../types'
import { todayISO, uid } from './format'

export const seedUsuarios: Usuario[] = [
  { id: 'u-admin', nome: 'Administradora', email: 'admin@salao.com', senha: '123456', papel: 'admin' },
]

export const seedProfissionais: Profissional[] = [
  {
    id: 'p1',
    nome: 'Camila Souza',
    telefone: '(61) 99111-2222',
    email: 'camila@salao.com',
    regimePagamento: 'comissao',
    comissaoPadrao: 40,
    aluguelValor: 0,
    aluguelPeriodicidade: 'quinzenal',
    ativo: true,
  },
  {
    id: 'p2',
    nome: 'Juliana Alves',
    telefone: '(61) 99222-3333',
    email: 'juliana@salao.com',
    regimePagamento: 'cadeira',
    comissaoPadrao: 0,
    aluguelValor: 250,
    aluguelPeriodicidade: 'quinzenal',
    ativo: true,
  },
]

export const seedServicos: Servico[] = [
  { id: 's1', nome: 'Corte Feminino', categoria: 'Cabelo', duracaoMin: 60, preco: 90, ativo: true },
  { id: 's2', nome: 'Escova', categoria: 'Cabelo', duracaoMin: 45, preco: 60, ativo: true },
  { id: 's3', nome: 'Manicure', categoria: 'Unhas', duracaoMin: 40, preco: 45, ativo: true },
  { id: 's4', nome: 'Pedicure', categoria: 'Unhas', duracaoMin: 40, preco: 50, ativo: true },
  { id: 's5', nome: 'Design de Sobrancelha', categoria: 'Estética', duracaoMin: 20, preco: 35, ativo: true },
]

export const seedClientes: Cliente[] = [
  { id: 'c1', nome: 'Ana Paula Ribeiro', telefone: '(61) 98888-1111', email: 'ana.ribeiro@email.com', criadoEm: todayISO() },
  { id: 'c2', nome: 'Beatriz Lima', telefone: '(61) 98888-2222', email: 'beatriz.lima@email.com', criadoEm: todayISO() },
]

export const seedPacoteModelos: PacoteModelo[] = [
  {
    id: 'pm1',
    nome: 'Pacote Mãos & Pés (4x)',
    itens: [
      { servicoId: 's3', quantidade: 4 },
      { servicoId: 's4', quantidade: 4 },
    ],
    preco: 320,
    ativo: true,
  },
  {
    id: 'pm2',
    nome: 'Pacote Escova (5x)',
    itens: [{ servicoId: 's2', quantidade: 5 }],
    preco: 260,
    ativo: true,
  },
]

export const seedPacotesCliente: PacoteCliente[] = [
  {
    id: uid(),
    clienteId: 'c1',
    pacoteModeloId: 'pm2',
    nome: 'Pacote Escova (5x)',
    itens: [{ servicoId: 's2', quantidade: 5, utilizado: 1 }],
    precoPago: 260,
    dataVenda: todayISO(),
    status: 'ativo',
  },
]

export const seedAgendamentos: Agendamento[] = [
  { id: uid(), clienteId: 'c1', profissionalId: 'p1', servicoId: 's1', data: todayISO(), horario: '09:00', duracaoMin: 60, status: 'agendado' },
  { id: uid(), clienteId: 'c2', profissionalId: 'p2', servicoId: 's3', data: todayISO(), horario: '10:30', duracaoMin: 40, status: 'agendado' },
]
