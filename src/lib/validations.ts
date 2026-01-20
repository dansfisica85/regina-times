import { z } from 'zod'
import { CategoriaQM, Carreira, JornadaAulas, UserRole, Status, TurnoTipo, DiaSemana } from './db/schema'

// ==================== VALIDAÇÕES DE PROFESSOR ====================

export const professorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200),
  cpf: z.string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos')
    .refine(validarCPF, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  categoria_qm: z.enum(CategoriaQM, { 
    errorMap: () => ({ message: 'Categoria QM inválida. Use: A, P, N, F, O ou V' }) 
  }),
  carreira: z.enum(Carreira, { 
    errorMap: () => ({ message: 'Carreira inválida. Use: ANTERIOR ou NOVA' }) 
  }),
  jornada_aulas: z.number().refine(
    (val) => JornadaAulas.includes(val as any),
    'Jornada inválida. Use: 9, 19, 20, 24 ou 32 aulas'
  ),
  formacao: z.string().optional(),
  experiencia_anos: z.number().min(0).max(50).optional(),
  disciplinas_ids: z.array(z.string().uuid()).optional(),
  escolas_ids: z.array(z.string().uuid()).min(1, 'Selecione pelo menos uma escola'),
}).refine(
  (data) => validarJornadaCarreira(data.carreira, data.jornada_aulas),
  {
    message: 'Combinação de carreira e jornada inválida',
    path: ['jornada_aulas'],
  }
)

// Validação de CPF
function validarCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false
  
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return false
  
  return true
}

// Validação de combinação carreira + jornada
function validarJornadaCarreira(carreira: string, jornada: number): boolean {
  if (carreira === 'ANTERIOR') {
    return [9, 19, 24, 32].includes(jornada)
  }
  if (carreira === 'NOVA') {
    return [20, 32].includes(jornada)
  }
  return false
}

// ==================== VALIDAÇÕES DE ESCOLA ====================

export const escolaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200),
  codigo: z.string().optional(),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  tipo: z.enum(['PEI', 'REGULAR']).optional(),
})

// ==================== VALIDAÇÕES DE TURNO ====================

export const turnoSchema = z.object({
  escola_id: z.string().uuid('ID da escola inválido'),
  tipo: z.enum(TurnoTipo),
  nome: z.string().min(2),
  horario_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  horario_fim: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
}).refine(
  (data) => data.horario_inicio < data.horario_fim,
  { message: 'Horário de início deve ser anterior ao fim', path: ['horario_fim'] }
)

export const turnoAulaSchema = z.object({
  turno_id: z.string().uuid(),
  numero_aula: z.number().min(1).max(10),
  horario_inicio: z.string().regex(/^\d{2}:\d{2}$/),
  horario_fim: z.string().regex(/^\d{2}:\d{2}$/),
  duracao_minutos: z.number().min(30).max(120).default(50),
})

// ==================== VALIDAÇÕES DE DISCIPLINA ====================

export const disciplinaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  codigo: z.string().optional(),
  carga_semanal_padrao: z.number().min(1).max(10).default(4),
  series: z.string().optional(), // JSON array
})

// ==================== VALIDAÇÕES DE TURMA ====================

export const turmaSchema = z.object({
  escola_id: z.string().uuid(),
  turno_id: z.string().uuid(),
  codigo: z.string().min(1, 'Código é obrigatório'),
  serie: z.string().min(1, 'Série é obrigatória'),
  ano_letivo: z.number().min(2020).max(2030).default(2026),
  sala: z.string().optional(),
  capacidade: z.number().min(1).max(60).optional(),
})

// ==================== VALIDAÇÕES DE GRADE HORÁRIA ====================

export const gradeHorariaSchema = z.object({
  turma_id: z.string().uuid(),
  turno_aula_id: z.string().uuid(),
  dia_semana: z.enum(DiaSemana),
  disciplina_id: z.string().uuid().optional(),
})

// ==================== VALIDAÇÕES DE ALOCAÇÃO ====================

export const alocacaoSchema = z.object({
  grade_horaria_id: z.string().uuid(),
  professor_id: z.string().uuid(),
  aula_tipo: z.enum(['REGULAR', 'EVENTUAL']).default('REGULAR'),
})

// ==================== VALIDAÇÕES DE USUÁRIO ====================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const usuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  role: z.enum(UserRole),
  escolas_ids: z.array(z.string().uuid()).optional(),
})

// Types exportados
export type ProfessorInput = z.infer<typeof professorSchema>
export type EscolaInput = z.infer<typeof escolaSchema>
export type TurnoInput = z.infer<typeof turnoSchema>
export type TurnoAulaInput = z.infer<typeof turnoAulaSchema>
export type DisciplinaInput = z.infer<typeof disciplinaSchema>
export type TurmaInput = z.infer<typeof turmaSchema>
export type GradeHorariaInput = z.infer<typeof gradeHorariaSchema>
export type AlocacaoInput = z.infer<typeof alocacaoSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UsuarioInput = z.infer<typeof usuarioSchema>
