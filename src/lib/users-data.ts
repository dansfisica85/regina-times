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

// 26 Escolas da rede SEDUC-SP (Diretoria de Ensino de Sertãozinho)
export const escolas: Escola[] = [
  // BARRINHA (2)
  { id: 'escola-01', nome: 'PEI EE Prof. José Luiz de Siqueira', codigo: 'E001', cidade: 'Barrinha' },
  { id: 'escola-02', nome: 'EE Luiz Marcari', codigo: 'E002', cidade: 'Barrinha' },
  // DUMONT (1)
  { id: 'escola-03', nome: 'PEI EE Prof. Nestor Gomes de Araújo', codigo: 'E003', cidade: 'Dumont' },
  // JARDINÓPOLIS (2)
  { id: 'escola-04', nome: 'EE Dr. Mário Lins', codigo: 'E004', cidade: 'Jardinópolis' },
  { id: 'escola-05', nome: 'EE Prof. Plínio Berardo', codigo: 'E005', cidade: 'Jardinópolis' },
  // PITANGUEIRAS (4)
  { id: 'escola-06', nome: 'PEI EE Domingos Paro', codigo: 'E006', cidade: 'Pitangueiras' },
  { id: 'escola-07', nome: 'PEI EE Maria Falconi de Felício', codigo: 'E007', cidade: 'Pitangueiras' },
  { id: 'escola-08', nome: 'EE Maurício Montecchi', codigo: 'E008', cidade: 'Pitangueiras' },
  { id: 'escola-09', nome: 'EE Orminda Guimarães Cotrim', codigo: 'E009', cidade: 'Pitangueiras' },
  // PONTAL (6)
  { id: 'escola-10', nome: 'EE Dona Adélia Frascino', codigo: 'E010', cidade: 'Pontal' },
  { id: 'escola-11', nome: 'EE Prof. Basílio Rodrigues da Silva', codigo: 'E011', cidade: 'Pontal' },
  { id: 'escola-12', nome: 'PEI EE Profª Dolores Belém Novaes', codigo: 'E012', cidade: 'Pontal' },
  { id: 'escola-13', nome: 'EE Profª Dolores Martins de Castro', codigo: 'E013', cidade: 'Pontal' },
  { id: 'escola-14', nome: 'EE Profª Josepha Castro', codigo: 'E014', cidade: 'Pontal' },
  { id: 'escola-15', nome: 'EE Profª Yolanda Luiz Sichieri', codigo: 'E015', cidade: 'Pontal' },
  // SERTÃOZINHO (9)
  { id: 'escola-16', nome: 'EE Anna Passamonti Balardin', codigo: 'E016', cidade: 'Sertãozinho' },
  { id: 'escola-17', nome: 'PEI EE Dr. Antônio Furlan Júnior', codigo: 'E017', cidade: 'Sertãozinho' },
  { id: 'escola-18', nome: 'EE Dr. Isaías José Ferreira', codigo: 'E018', cidade: 'Sertãozinho' },
  { id: 'escola-19', nome: 'EE Ferrucio Chiaratti', codigo: 'E019', cidade: 'Sertãozinho' },
  { id: 'escola-20', nome: 'EE Prof. Bruno Pieroni', codigo: 'E020', cidade: 'Sertãozinho' },
  { id: 'escola-21', nome: 'EE Profª Edith Silveira Dalmaso', codigo: 'E021', cidade: 'Sertãozinho' },
  { id: 'escola-22', nome: 'PEI EE Profª Maria Conceição R. Silva Magon', codigo: 'E022', cidade: 'Sertãozinho' },
  { id: 'escola-23', nome: 'EE Profª Nícia Fabíola Zanutto Giraldi', codigo: 'E023', cidade: 'Sertãozinho' },
  { id: 'escola-24', nome: 'PEI EE Winston Churchill', codigo: 'E024', cidade: 'Sertãozinho' },
  // TERRA ROXA (1)
  { id: 'escola-25', nome: 'PEI EE Profª Maria Élyde Mônaco dos Santos', codigo: 'E025', cidade: 'Terra Roxa' },
  // VIRADOURO (1)
  { id: 'escola-26', nome: 'EE Odulfo de Oliveira Guimarães', codigo: 'E026', cidade: 'Viradouro' },
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
  // BARRINHA (2)
  { id: 'user-escola-01', email: 'escola01@reginatimes.edu.br', senha: 'Escola01@2026', nome: 'Diretor PEI EE Prof. José Luiz de Siqueira', role: 'ESCOLA', escolaId: 'escola-01' },
  { id: 'user-escola-02', email: 'escola02@reginatimes.edu.br', senha: 'Escola02@2026', nome: 'Diretor EE Luiz Marcari', role: 'ESCOLA', escolaId: 'escola-02' },
  // DUMONT (1)
  { id: 'user-escola-03', email: 'escola03@reginatimes.edu.br', senha: 'Escola03@2026', nome: 'Diretor PEI EE Prof. Nestor Gomes de Araújo', role: 'ESCOLA', escolaId: 'escola-03' },
  // JARDINÓPOLIS (2)
  { id: 'user-escola-04', email: 'escola04@reginatimes.edu.br', senha: 'Escola04@2026', nome: 'Diretor EE Dr. Mário Lins', role: 'ESCOLA', escolaId: 'escola-04' },
  { id: 'user-escola-05', email: 'escola05@reginatimes.edu.br', senha: 'Escola05@2026', nome: 'Diretor EE Prof. Plínio Berardo', role: 'ESCOLA', escolaId: 'escola-05' },
  // PITANGUEIRAS (4)
  { id: 'user-escola-06', email: 'escola06@reginatimes.edu.br', senha: 'Escola06@2026', nome: 'Diretor PEI EE Domingos Paro', role: 'ESCOLA', escolaId: 'escola-06' },
  { id: 'user-escola-07', email: 'escola07@reginatimes.edu.br', senha: 'Escola07@2026', nome: 'Diretor PEI EE Maria Falconi de Felício', role: 'ESCOLA', escolaId: 'escola-07' },
  { id: 'user-escola-08', email: 'escola08@reginatimes.edu.br', senha: 'Escola08@2026', nome: 'Diretor EE Maurício Montecchi', role: 'ESCOLA', escolaId: 'escola-08' },
  { id: 'user-escola-09', email: 'escola09@reginatimes.edu.br', senha: 'Escola09@2026', nome: 'Diretor EE Orminda Guimarães Cotrim', role: 'ESCOLA', escolaId: 'escola-09' },
  // PONTAL (6)
  { id: 'user-escola-10', email: 'escola10@reginatimes.edu.br', senha: 'Escola10@2026', nome: 'Diretor EE Dona Adélia Frascino', role: 'ESCOLA', escolaId: 'escola-10' },
  { id: 'user-escola-11', email: 'escola11@reginatimes.edu.br', senha: 'Escola11@2026', nome: 'Diretor EE Prof. Basílio Rodrigues da Silva', role: 'ESCOLA', escolaId: 'escola-11' },
  { id: 'user-escola-12', email: 'escola12@reginatimes.edu.br', senha: 'Escola12@2026', nome: 'Diretor PEI EE Profª Dolores Belém Novaes', role: 'ESCOLA', escolaId: 'escola-12' },
  { id: 'user-escola-13', email: 'escola13@reginatimes.edu.br', senha: 'Escola13@2026', nome: 'Diretor EE Profª Dolores Martins de Castro', role: 'ESCOLA', escolaId: 'escola-13' },
  { id: 'user-escola-14', email: 'escola14@reginatimes.edu.br', senha: 'Escola14@2026', nome: 'Diretor EE Profª Josepha Castro', role: 'ESCOLA', escolaId: 'escola-14' },
  { id: 'user-escola-15', email: 'escola15@reginatimes.edu.br', senha: 'Escola15@2026', nome: 'Diretor EE Profª Yolanda Luiz Sichieri', role: 'ESCOLA', escolaId: 'escola-15' },
  // SERTÃOZINHO (9)
  { id: 'user-escola-16', email: 'escola16@reginatimes.edu.br', senha: 'Escola16@2026', nome: 'Diretor EE Anna Passamonti Balardin', role: 'ESCOLA', escolaId: 'escola-16' },
  { id: 'user-escola-17', email: 'escola17@reginatimes.edu.br', senha: 'Escola17@2026', nome: 'Diretor PEI EE Dr. Antônio Furlan Júnior', role: 'ESCOLA', escolaId: 'escola-17' },
  { id: 'user-escola-18', email: 'escola18@reginatimes.edu.br', senha: 'Escola18@2026', nome: 'Diretor EE Dr. Isaías José Ferreira', role: 'ESCOLA', escolaId: 'escola-18' },
  { id: 'user-escola-19', email: 'escola19@reginatimes.edu.br', senha: 'Escola19@2026', nome: 'Diretor EE Ferrucio Chiaratti', role: 'ESCOLA', escolaId: 'escola-19' },
  { id: 'user-escola-20', email: 'escola20@reginatimes.edu.br', senha: 'Escola20@2026', nome: 'Diretor EE Prof. Bruno Pieroni', role: 'ESCOLA', escolaId: 'escola-20' },
  { id: 'user-escola-21', email: 'escola21@reginatimes.edu.br', senha: 'Escola21@2026', nome: 'Diretor EE Profª Edith Silveira Dalmaso', role: 'ESCOLA', escolaId: 'escola-21' },
  { id: 'user-escola-22', email: 'escola22@reginatimes.edu.br', senha: 'Escola22@2026', nome: 'Diretor PEI EE Profª Maria Conceição R. Silva Magon', role: 'ESCOLA', escolaId: 'escola-22' },
  { id: 'user-escola-23', email: 'escola23@reginatimes.edu.br', senha: 'Escola23@2026', nome: 'Diretor EE Profª Nícia Fabíola Zanutto Giraldi', role: 'ESCOLA', escolaId: 'escola-23' },
  { id: 'user-escola-24', email: 'escola24@reginatimes.edu.br', senha: 'Escola24@2026', nome: 'Diretor PEI EE Winston Churchill', role: 'ESCOLA', escolaId: 'escola-24' },
  // TERRA ROXA (1)
  { id: 'user-escola-25', email: 'escola25@reginatimes.edu.br', senha: 'Escola25@2026', nome: 'Diretor PEI EE Profª Maria Élyde Mônaco dos Santos', role: 'ESCOLA', escolaId: 'escola-25' },
  // VIRADOURO (1)
  { id: 'user-escola-26', email: 'escola26@reginatimes.edu.br', senha: 'Escola26@2026', nome: 'Diretor EE Odulfo de Oliveira Guimarães', role: 'ESCOLA', escolaId: 'escola-26' },
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
