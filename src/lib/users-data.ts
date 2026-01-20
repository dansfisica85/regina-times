// ==================== DADOS DE USUÁRIOS E ESCOLAS ====================
// Sistema Regina Times - SEDUC-SP

export interface Escola {
  id: string
  nome: string
  codigo: string
  cidade: string
}

export interface Usuario {
  id: string
  email: string
  senha: string
  nome: string
  role: 'ADMIN' | 'ESCOLA' | 'VISUALIZADOR' | 'OBSERVADOR'
  escolaId?: string
}

// 26 Escolas da rede SEDUC-SP
export const escolas: Escola[] = [
  { id: 'escola-01', nome: 'EE Prof. Maria da Silva', codigo: 'E001', cidade: 'São Paulo' },
  { id: 'escola-02', nome: 'EE Dr. João Santos', codigo: 'E002', cidade: 'São Paulo' },
  { id: 'escola-03', nome: 'EE Governador Franco Montoro', codigo: 'E003', cidade: 'Campinas' },
  { id: 'escola-04', nome: 'EE Prof. Ana Costa', codigo: 'E004', cidade: 'Santos' },
  { id: 'escola-05', nome: 'EE Dom Pedro II', codigo: 'E005', cidade: 'Ribeirão Preto' },
  { id: 'escola-06', nome: 'EE Presidente Vargas', codigo: 'E006', cidade: 'São José dos Campos' },
  { id: 'escola-07', nome: 'EE Prof. Carlos Drummond', codigo: 'E007', cidade: 'Sorocaba' },
  { id: 'escola-08', nome: 'EE Tiradentes', codigo: 'E008', cidade: 'Osasco' },
  { id: 'escola-09', nome: 'EE Castro Alves', codigo: 'E009', cidade: 'Santo André' },
  { id: 'escola-10', nome: 'EE Machado de Assis', codigo: 'E010', cidade: 'São Bernardo do Campo' },
  { id: 'escola-11', nome: 'EE Monteiro Lobato', codigo: 'E011', cidade: 'Guarulhos' },
  { id: 'escola-12', nome: 'EE Cecília Meireles', codigo: 'E012', cidade: 'Mauá' },
  { id: 'escola-13', nome: 'EE Rui Barbosa', codigo: 'E013', cidade: 'Diadema' },
  { id: 'escola-14', nome: 'EE José de Alencar', codigo: 'E014', cidade: 'Carapicuíba' },
  { id: 'escola-15', nome: 'EE Prof. Paulo Freire', codigo: 'E015', cidade: 'Bauru' },
  { id: 'escola-16', nome: 'EE Anita Garibaldi', codigo: 'E016', cidade: 'Piracicaba' },
  { id: 'escola-17', nome: 'EE Santos Dumont', codigo: 'E017', cidade: 'Jundiaí' },
  { id: 'escola-18', nome: 'EE Princesa Isabel', codigo: 'E018', cidade: 'Franca' },
  { id: 'escola-19', nome: 'EE Prof. Darcy Ribeiro', codigo: 'E019', cidade: 'Taubaté' },
  { id: 'escola-20', nome: 'EE Vila Lobos', codigo: 'E020', cidade: 'Marília' },
  { id: 'escola-21', nome: 'EE Prof. Florestan Fernandes', codigo: 'E021', cidade: 'Presidente Prudente' },
  { id: 'escola-22', nome: 'EE Cândido Portinari', codigo: 'E022', cidade: 'Araraquara' },
  { id: 'escola-23', nome: 'EE Oscar Niemeyer', codigo: 'E023', cidade: 'São Carlos' },
  { id: 'escola-24', nome: 'EE Prof. Milton Santos', codigo: 'E024', cidade: 'Limeira' },
  { id: 'escola-25', nome: 'EE Tarsila do Amaral', codigo: 'E025', cidade: 'Rio Claro' },
  { id: 'escola-26', nome: 'EE Prof. Sergio Buarque', codigo: 'E026', cidade: 'Itapetininga' },
]

// Todos os usuários do sistema (29 no total)
export const usuarios: Usuario[] = [
  // Administrador Geral (acesso total)
  {
    id: 'admin-001',
    email: 'admin@reginatimes.edu.br',
    senha: 'Admin@2026!',
    nome: 'Administrador Geral',
    role: 'ADMIN',
  },
  
  // Visualizador Geral (apenas visualiza todas as escolas)
  {
    id: 'visual-001',
    email: 'visualizador@reginatimes.edu.br',
    senha: 'Visual@2026!',
    nome: 'Visualizador Geral',
    role: 'VISUALIZADOR',
  },
  
  // Observador (apenas observa, sem alterações)
  {
    id: 'obs-001',
    email: 'observador@reginatimes.edu.br',
    senha: 'Obs@2026!',
    nome: 'Observador SEDUC',
    role: 'OBSERVADOR',
  },
  
  // 26 Usuários de Escolas (um para cada escola)
  { id: 'user-escola-01', email: 'escola01@reginatimes.edu.br', senha: 'Escola01@2026', nome: 'Diretor EE Prof. Maria da Silva', role: 'ESCOLA', escolaId: 'escola-01' },
  { id: 'user-escola-02', email: 'escola02@reginatimes.edu.br', senha: 'Escola02@2026', nome: 'Diretor EE Dr. João Santos', role: 'ESCOLA', escolaId: 'escola-02' },
  { id: 'user-escola-03', email: 'escola03@reginatimes.edu.br', senha: 'Escola03@2026', nome: 'Diretor EE Gov. Franco Montoro', role: 'ESCOLA', escolaId: 'escola-03' },
  { id: 'user-escola-04', email: 'escola04@reginatimes.edu.br', senha: 'Escola04@2026', nome: 'Diretor EE Prof. Ana Costa', role: 'ESCOLA', escolaId: 'escola-04' },
  { id: 'user-escola-05', email: 'escola05@reginatimes.edu.br', senha: 'Escola05@2026', nome: 'Diretor EE Dom Pedro II', role: 'ESCOLA', escolaId: 'escola-05' },
  { id: 'user-escola-06', email: 'escola06@reginatimes.edu.br', senha: 'Escola06@2026', nome: 'Diretor EE Pres. Vargas', role: 'ESCOLA', escolaId: 'escola-06' },
  { id: 'user-escola-07', email: 'escola07@reginatimes.edu.br', senha: 'Escola07@2026', nome: 'Diretor EE Prof. Carlos Drummond', role: 'ESCOLA', escolaId: 'escola-07' },
  { id: 'user-escola-08', email: 'escola08@reginatimes.edu.br', senha: 'Escola08@2026', nome: 'Diretor EE Tiradentes', role: 'ESCOLA', escolaId: 'escola-08' },
  { id: 'user-escola-09', email: 'escola09@reginatimes.edu.br', senha: 'Escola09@2026', nome: 'Diretor EE Castro Alves', role: 'ESCOLA', escolaId: 'escola-09' },
  { id: 'user-escola-10', email: 'escola10@reginatimes.edu.br', senha: 'Escola10@2026', nome: 'Diretor EE Machado de Assis', role: 'ESCOLA', escolaId: 'escola-10' },
  { id: 'user-escola-11', email: 'escola11@reginatimes.edu.br', senha: 'Escola11@2026', nome: 'Diretor EE Monteiro Lobato', role: 'ESCOLA', escolaId: 'escola-11' },
  { id: 'user-escola-12', email: 'escola12@reginatimes.edu.br', senha: 'Escola12@2026', nome: 'Diretor EE Cecília Meireles', role: 'ESCOLA', escolaId: 'escola-12' },
  { id: 'user-escola-13', email: 'escola13@reginatimes.edu.br', senha: 'Escola13@2026', nome: 'Diretor EE Rui Barbosa', role: 'ESCOLA', escolaId: 'escola-13' },
  { id: 'user-escola-14', email: 'escola14@reginatimes.edu.br', senha: 'Escola14@2026', nome: 'Diretor EE José de Alencar', role: 'ESCOLA', escolaId: 'escola-14' },
  { id: 'user-escola-15', email: 'escola15@reginatimes.edu.br', senha: 'Escola15@2026', nome: 'Diretor EE Prof. Paulo Freire', role: 'ESCOLA', escolaId: 'escola-15' },
  { id: 'user-escola-16', email: 'escola16@reginatimes.edu.br', senha: 'Escola16@2026', nome: 'Diretor EE Anita Garibaldi', role: 'ESCOLA', escolaId: 'escola-16' },
  { id: 'user-escola-17', email: 'escola17@reginatimes.edu.br', senha: 'Escola17@2026', nome: 'Diretor EE Santos Dumont', role: 'ESCOLA', escolaId: 'escola-17' },
  { id: 'user-escola-18', email: 'escola18@reginatimes.edu.br', senha: 'Escola18@2026', nome: 'Diretor EE Princesa Isabel', role: 'ESCOLA', escolaId: 'escola-18' },
  { id: 'user-escola-19', email: 'escola19@reginatimes.edu.br', senha: 'Escola19@2026', nome: 'Diretor EE Prof. Darcy Ribeiro', role: 'ESCOLA', escolaId: 'escola-19' },
  { id: 'user-escola-20', email: 'escola20@reginatimes.edu.br', senha: 'Escola20@2026', nome: 'Diretor EE Vila Lobos', role: 'ESCOLA', escolaId: 'escola-20' },
  { id: 'user-escola-21', email: 'escola21@reginatimes.edu.br', senha: 'Escola21@2026', nome: 'Diretor EE Prof. Florestan Fernandes', role: 'ESCOLA', escolaId: 'escola-21' },
  { id: 'user-escola-22', email: 'escola22@reginatimes.edu.br', senha: 'Escola22@2026', nome: 'Diretor EE Cândido Portinari', role: 'ESCOLA', escolaId: 'escola-22' },
  { id: 'user-escola-23', email: 'escola23@reginatimes.edu.br', senha: 'Escola23@2026', nome: 'Diretor EE Oscar Niemeyer', role: 'ESCOLA', escolaId: 'escola-23' },
  { id: 'user-escola-24', email: 'escola24@reginatimes.edu.br', senha: 'Escola24@2026', nome: 'Diretor EE Prof. Milton Santos', role: 'ESCOLA', escolaId: 'escola-24' },
  { id: 'user-escola-25', email: 'escola25@reginatimes.edu.br', senha: 'Escola25@2026', nome: 'Diretor EE Tarsila do Amaral', role: 'ESCOLA', escolaId: 'escola-25' },
  { id: 'user-escola-26', email: 'escola26@reginatimes.edu.br', senha: 'Escola26@2026', nome: 'Diretor EE Prof. Sergio Buarque', role: 'ESCOLA', escolaId: 'escola-26' },
]

// Função para buscar usuário por email
export function findUserByEmail(email: string): Usuario | undefined {
  return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Função para buscar escola por ID
export function findEscolaById(id: string): Escola | undefined {
  return escolas.find(e => e.id === id)
}

// Função para verificar se usuário tem acesso a uma escola
export function hasAccessToEscola(user: Usuario, escolaId: string): boolean {
  if (user.role === 'ADMIN' || user.role === 'VISUALIZADOR' || user.role === 'OBSERVADOR') {
    return true
  }
  return user.escolaId === escolaId
}

// Função para verificar se usuário pode editar
export function canEdit(user: Usuario): boolean {
  return user.role === 'ADMIN' || user.role === 'ESCOLA'
}

// Função para verificar se usuário pode editar uma escola específica
export function canEditEscola(user: Usuario, escolaId: string): boolean {
  if (user.role === 'ADMIN') return true
  if (user.role === 'ESCOLA') return user.escolaId === escolaId
  return false
}
