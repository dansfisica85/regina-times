import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

// ==================== ENUMS ====================

export const CategoriaQM = ['A', 'P', 'N', 'F', 'O', 'V'] as const
export type CategoriaQMType = typeof CategoriaQM[number]

export const Carreira = ['ANTERIOR', 'NOVA'] as const
export type CarreiraType = typeof Carreira[number]

export const JornadaAulas = [9, 19, 20, 24, 32] as const
export type JornadaAulasType = typeof JornadaAulas[number]

export const UserRole = ['ADMIN', 'ESCOLA', 'VISUALIZADOR', 'OBSERVADOR'] as const
export type UserRoleType = typeof UserRole[number]

export const Status = ['ATIVO', 'INATIVO'] as const
export type StatusType = typeof Status[number]

export const TurnoTipo = ['MATUTINO', 'VESPERTINO', 'NOTURNO'] as const
export type TurnoTipoType = typeof TurnoTipo[number]

export const DiaSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'] as const
export type DiaSemanaType = typeof DiaSemana[number]

export const AulaTipo = ['REGULAR', 'EVENTUAL'] as const
export type AulaTipoType = typeof AulaTipo[number]

// ==================== TABELAS ====================

// Usuários do sistema
export const usuarios = sqliteTable('usuarios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  senha_hash: text('senha_hash').notNull(),
  nome: text('nome').notNull(),
  role: text('role').notNull().$type<UserRoleType>(),
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Escolas (26 instituições)
export const escolas = sqliteTable('escolas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  codigo: text('codigo').unique(),
  cidade: text('cidade').notNull(),
  endereco: text('endereco'),
  telefone: text('telefone'),
  email: text('email'),
  tipo: text('tipo'), // PEI ou Regular
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Usuários vinculados a escolas
export const usuario_escolas = sqliteTable('usuario_escolas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  usuario_id: text('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  escola_id: text('escola_id').notNull().references(() => escolas.id, { onDelete: 'cascade' }),
})

// Professores
export const professores = sqliteTable('professores', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  cpf: text('cpf').notNull().unique(),
  email: text('email').notNull(),
  telefone: text('telefone'),
  nome: text('nome').notNull(),
  categoria_qm: text('categoria_qm').notNull().$type<CategoriaQMType>(),
  carreira: text('carreira').notNull().$type<CarreiraType>(),
  jornada_aulas: integer('jornada_aulas').notNull().$type<JornadaAulasType>(),
  formacao: text('formacao'),
  experiencia_anos: integer('experiencia_anos').default(0),
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Professor vinculado a escolas
export const professor_escolas = sqliteTable('professor_escolas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  professor_id: text('professor_id').notNull().references(() => professores.id, { onDelete: 'cascade' }),
  escola_id: text('escola_id').notNull().references(() => escolas.id, { onDelete: 'cascade' }),
  aulas_atribuidas: integer('aulas_atribuidas').default(0),
})

// Disciplinas
export const disciplinas = sqliteTable('disciplinas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  codigo: text('codigo').unique(),
  carga_semanal_padrao: integer('carga_semanal_padrao').default(4),
  series: text('series'), // JSON array de séries/anos aplicáveis
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Professor vinculado a disciplinas
export const professor_disciplinas = sqliteTable('professor_disciplinas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  professor_id: text('professor_id').notNull().references(() => professores.id, { onDelete: 'cascade' }),
  disciplina_id: text('disciplina_id').notNull().references(() => disciplinas.id, { onDelete: 'cascade' }),
})

// Turnos por escola
export const turnos = sqliteTable('turnos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  escola_id: text('escola_id').notNull().references(() => escolas.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull().$type<TurnoTipoType>(),
  nome: text('nome').notNull(),
  horario_inicio: text('horario_inicio').notNull(), // HH:MM
  horario_fim: text('horario_fim').notNull(),
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
})

// Aulas/slots dentro de cada turno
export const turno_aulas = sqliteTable('turno_aulas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turno_id: text('turno_id').notNull().references(() => turnos.id, { onDelete: 'cascade' }),
  numero_aula: integer('numero_aula').notNull(), // 1, 2, 3...
  horario_inicio: text('horario_inicio').notNull(),
  horario_fim: text('horario_fim').notNull(),
  duracao_minutos: integer('duracao_minutos').default(50),
})

// Intervalos/recreios
export const turno_intervalos = sqliteTable('turno_intervalos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turno_id: text('turno_id').notNull().references(() => turnos.id, { onDelete: 'cascade' }),
  apos_aula: integer('apos_aula').notNull(), // após qual aula
  horario_inicio: text('horario_inicio').notNull(),
  horario_fim: text('horario_fim').notNull(),
  tipo: text('tipo').default('RECREIO'), // RECREIO, ALMOCO, INTERVALO
})

// Turmas
export const turmas = sqliteTable('turmas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  escola_id: text('escola_id').notNull().references(() => escolas.id, { onDelete: 'cascade' }),
  turno_id: text('turno_id').notNull().references(() => turnos.id),
  codigo: text('codigo').notNull(),
  serie: text('serie').notNull(), // 1º ano, 2º ano, etc.
  ano_letivo: integer('ano_letivo').notNull().default(2026),
  sala: text('sala'),
  capacidade: integer('capacidade'),
  status: text('status').notNull().default('ATIVO').$type<StatusType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Grade horária (turma_slot → disciplina, sem professor)
export const grades_horarias = sqliteTable('grades_horarias', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turma_id: text('turma_id').notNull().references(() => turmas.id, { onDelete: 'cascade' }),
  turno_aula_id: text('turno_aula_id').notNull().references(() => turno_aulas.id),
  dia_semana: text('dia_semana').notNull().$type<DiaSemanaType>(),
  disciplina_id: text('disciplina_id').references(() => disciplinas.id),
})

// Alocações (turma_slot → professor)
export const alocacoes = sqliteTable('alocacoes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  grade_horaria_id: text('grade_horaria_id').notNull().references(() => grades_horarias.id, { onDelete: 'cascade' }),
  professor_id: text('professor_id').references(() => professores.id),
  aula_tipo: text('aula_tipo').default('REGULAR').$type<AulaTipoType>(),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizado_em: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Disponibilidade do professor
export const professor_disponibilidade = sqliteTable('professor_disponibilidade', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  professor_id: text('professor_id').notNull().references(() => professores.id, { onDelete: 'cascade' }),
  escola_id: text('escola_id').notNull().references(() => escolas.id, { onDelete: 'cascade' }),
  dia_semana: text('dia_semana').notNull().$type<DiaSemanaType>(),
  turno_tipo: text('turno_tipo').notNull().$type<TurnoTipoType>(),
  disponivel: integer('disponivel', { mode: 'boolean' }).default(true),
})

// Acúmulo de cargos
export const acumulos_cargos = sqliteTable('acumulos_cargos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  professor_id: text('professor_id').notNull().references(() => professores.id, { onDelete: 'cascade' }),
  escola_origem_id: text('escola_origem_id').notNull().references(() => escolas.id),
  escola_destino_id: text('escola_destino_id').notNull().references(() => escolas.id),
  aulas_compartilhadas: integer('aulas_compartilhadas').default(0),
  aprovado: integer('aprovado', { mode: 'boolean' }).default(false),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
})

// Log de auditoria
export const auditoria = sqliteTable('auditoria', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  usuario_id: text('usuario_id').references(() => usuarios.id),
  acao: text('acao').notNull(),
  entidade: text('entidade').notNull(), // tabela afetada
  entidade_id: text('entidade_id'),
  dados_anteriores: text('dados_anteriores'), // JSON
  dados_novos: text('dados_novos'), // JSON
  ip: text('ip'),
  criado_em: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
})

// ==================== RELATIONS ====================

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  escolas: many(usuario_escolas),
  auditorias: many(auditoria),
}))

export const escolasRelations = relations(escolas, ({ many }) => ({
  usuarios: many(usuario_escolas),
  professores: many(professor_escolas),
  turnos: many(turnos),
  turmas: many(turmas),
}))

export const professoresRelations = relations(professores, ({ many }) => ({
  escolas: many(professor_escolas),
  disciplinas: many(professor_disciplinas),
  disponibilidades: many(professor_disponibilidade),
  alocacoes: many(alocacoes),
}))

export const disciplinasRelations = relations(disciplinas, ({ many }) => ({
  professores: many(professor_disciplinas),
  grades: many(grades_horarias),
}))

export const turnosRelations = relations(turnos, ({ one, many }) => ({
  escola: one(escolas, {
    fields: [turnos.escola_id],
    references: [escolas.id],
  }),
  aulas: many(turno_aulas),
  intervalos: many(turno_intervalos),
  turmas: many(turmas),
}))

export const turmasRelations = relations(turmas, ({ one, many }) => ({
  escola: one(escolas, {
    fields: [turmas.escola_id],
    references: [escolas.id],
  }),
  turno: one(turnos, {
    fields: [turmas.turno_id],
    references: [turnos.id],
  }),
  grades: many(grades_horarias),
}))

export const gradesHorariasRelations = relations(grades_horarias, ({ one, many }) => ({
  turma: one(turmas, {
    fields: [grades_horarias.turma_id],
    references: [turmas.id],
  }),
  turnoAula: one(turno_aulas, {
    fields: [grades_horarias.turno_aula_id],
    references: [turno_aulas.id],
  }),
  disciplina: one(disciplinas, {
    fields: [grades_horarias.disciplina_id],
    references: [disciplinas.id],
  }),
  alocacoes: many(alocacoes),
}))

export const alocacoesRelations = relations(alocacoes, ({ one }) => ({
  gradeHoraria: one(grades_horarias, {
    fields: [alocacoes.grade_horaria_id],
    references: [grades_horarias.id],
  }),
  professor: one(professores, {
    fields: [alocacoes.professor_id],
    references: [professores.id],
  }),
}))
