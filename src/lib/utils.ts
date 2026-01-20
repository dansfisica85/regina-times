import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatar CPF para exibição
export function formatarCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Remover formatação do CPF
export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

// Formatar telefone
export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, '')
  if (limpo.length === 11) {
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

// Mapeamento de dias da semana
export const diasSemana = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
} as const

// Mapeamento de turnos
export const turnoNomes = {
  MATUTINO: 'Matutino',
  VESPERTINO: 'Vespertino',
  NOTURNO: 'Noturno',
} as const

// Mapeamento de categorias QM
export const categoriasQM = {
  A: { nome: 'Categoria A', descricao: 'Efetivo - Titular de cargo', prioridade: 1 },
  P: { nome: 'Categoria P', descricao: 'Estável CF/88', prioridade: 2 },
  N: { nome: 'Categoria N', descricao: 'Celetista', prioridade: 2 },
  F: { nome: 'Categoria F', descricao: 'Função-atividade LC 1.010/2007', prioridade: 2 },
  O: { nome: 'Categoria O', descricao: 'Contratado LC 1.093/2009', prioridade: 3 },
  V: { nome: 'Categoria V', descricao: 'Aulas eventuais', prioridade: 4 },
} as const

// Mapeamento de jornadas
export const jornadasCarreira = {
  ANTERIOR: {
    9: 'Reduzida (9 aulas)',
    19: 'Inicial (19 aulas)',
    24: 'Básica (24 aulas)',
    32: 'Integral (32 aulas)',
  },
  NOVA: {
    20: 'Completa (20 aulas)',
    32: 'Ampliada (32 aulas)',
  },
} as const

// Lista de escolas participantes por cidade
export const escolasParticipantes = {
  BARRINHA: [
    { nome: 'PEI EE Prof. José Luiz de Siqueira', tipo: 'PEI' },
    { nome: 'EE Luiz Marcari', tipo: 'REGULAR' },
  ],
  DUMONT: [
    { nome: 'PEI EE Prof. Nestor Gomes de Araújo', tipo: 'PEI' },
  ],
  JARDINÓPOLIS: [
    { nome: 'EE Dr. Mário Lins', tipo: 'REGULAR' },
    { nome: 'EE Prof. Plínio Berardo', tipo: 'REGULAR' },
  ],
  PITANGUEIRAS: [
    { nome: 'PEI EE Domingos Paro', tipo: 'PEI' },
    { nome: 'PEI EE Maria Falconi de Felício', tipo: 'PEI' },
    { nome: 'EE Maurício Montecchi', tipo: 'REGULAR' },
    { nome: 'EE Orminda Guimarães Cotrim', tipo: 'REGULAR' },
  ],
  PONTAL: [
    { nome: 'EE Dona Adélia Frascino', tipo: 'REGULAR' },
    { nome: 'EE Prof. Basílio Rodrigues da Silva', tipo: 'REGULAR' },
    { nome: 'PEI EE Profª Dolores Belém Novaes', tipo: 'PEI' },
    { nome: 'EE Profª Dolores Martins de Castro', tipo: 'REGULAR' },
    { nome: 'EE Profª Josepha Castro', tipo: 'REGULAR' },
    { nome: 'EE Profª Yolanda Luiz Sichieri', tipo: 'REGULAR' },
  ],
  SERTÃOZINHO: [
    { nome: 'EE Anna Passamonti Balardin', tipo: 'REGULAR' },
    { nome: 'PEI EE Dr. Antônio Furlan Júnior', tipo: 'PEI' },
    { nome: 'EE Dr. Isaías José Ferreira', tipo: 'REGULAR' },
    { nome: 'EE Ferrucio Chiaratti', tipo: 'REGULAR' },
    { nome: 'EE Prof. Bruno Pieroni', tipo: 'REGULAR' },
    { nome: 'EE Profª Edith Silveira Dalmaso', tipo: 'REGULAR' },
    { nome: 'PEI EE Profª Maria Conceição R. Silva Magon', tipo: 'PEI' },
    { nome: 'EE Profª Nícia Fabíola Zanutto Giraldi', tipo: 'REGULAR' },
    { nome: 'PEI EE Winston Churchill', tipo: 'PEI' },
  ],
  'TERRA ROXA': [
    { nome: 'PEI EE Profª Maria Élyde Mônaco dos Santos', tipo: 'PEI' },
  ],
  VIRADOURO: [
    { nome: 'EE Odulfo de Oliveira Guimarães', tipo: 'REGULAR' },
  ],
} as const

// Gerar ID único
export function gerarId(): string {
  return crypto.randomUUID()
}

// Calcular total de aulas alocadas de um professor
export function calcularAulasAlocadas(alocacoes: Array<{ status?: string }>): number {
  return alocacoes.filter(a => a.status !== 'CANCELADA').length
}

// Verificar se professor pode receber mais aulas
export function podeReceberMaisAulas(
  jornadaAulas: number, 
  aulasAtuais: number, 
  novasAulas: number = 1
): boolean {
  return (aulasAtuais + novasAulas) <= jornadaAulas
}

// Ordenar professores por prioridade de categoria
export function ordenarPorCategoriaQM<T extends { categoria_qm: string; aulas_alocadas?: number }>(
  professores: T[]
): T[] {
  const prioridades: Record<string, number> = { A: 1, P: 2, N: 2, F: 2, O: 3, V: 4 }
  
  return [...professores].sort((a, b) => {
    const prioridadeA = prioridades[a.categoria_qm] || 5
    const prioridadeB = prioridades[b.categoria_qm] || 5
    
    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB
    }
    
    // Mesma prioridade: ordenar por menor carga alocada
    const aulasA = a.aulas_alocadas || 0
    const aulasB = b.aulas_alocadas || 0
    return aulasA - aulasB
  })
}
