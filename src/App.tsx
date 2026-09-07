import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Agenda } from './pages/Agenda'
import { AtendimentoNovo } from './pages/AtendimentoNovo'
import { Clientes } from './pages/Clientes'
import { ClienteFicha } from './pages/ClienteFicha'
import { Profissionais } from './pages/Profissionais'
import { ProfissionalProducao } from './pages/ProfissionalProducao'
import { Servicos } from './pages/Servicos'
import { Pacotes } from './pages/Pacotes'
import { Fechamentos } from './pages/Fechamentos'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/atendimento/novo" element={<AtendimentoNovo />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/:id" element={<ClienteFicha />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/profissionais/:id" element={<ProfissionalProducao />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/pacotes" element={<Pacotes />} />
          <Route path="/fechamentos" element={<Fechamentos />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
