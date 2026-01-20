/**
 * Algoritmo de Geração Automática de Horários
 * 
 * Implementa as regras da SEDUC-SP para alocação de professores
 * respeitando categorias do Quadro de Magistério e jornadas de trabalho.
 */

import { CategoriaQMType, DiaSemanaType, TurnoTipoType } from './db/schema'

// ==================== TIPOS ====================

interface Professor {
  id: string
  nome: string
  categoria_qm: CategoriaQMType
  jornada_aulas: number
  aulas_alocadas: number
  disciplinas: string[]
  escolas: string[]
  disponibilidade: {
    dia: DiaSemanaType
    turno: TurnoTipoType
    disponivel: boolean
  }[]
}

interface SlotHorario {
  id: string
  turma_id: string
  disciplina_id: string
  dia: DiaSemanaType
  aula_numero: number
  turno: TurnoTipoType
  escola_id: string
}

interface Alocacao {
  slot_id: string
  professor_id: string
  aula_tipo: 'REGULAR' | 'EVENTUAL'
}

interface ResultadoGeracao {
  alocacoes: Alocacao[]
  conflitos: {
    slot_id: string
    motivo: string
  }[]
  estatisticas: {
    total_slots: number
    alocados: number
    conflitos: number
    sem_professor: number
  }
}

// ==================== PRIORIZAÇÃO POR CATEGORIA QM ====================

/**
 * Retorna a prioridade numérica da categoria QM
 * Quanto menor o número, maior a prioridade
 */
function getPrioridadeCategoria(categoria: CategoriaQMType): number {
  switch (categoria) {
    case 'A': return 1  // Efetivos - maior prioridade
    case 'P': return 2  // Estáveis CF/88
    case 'N': return 2  // Celetistas
    case 'F': return 2  // Função-atividade
    case 'O': return 3  // Contratados
    case 'V': return 4  // Eventuais - menor prioridade
    default: return 5
  }
}

/**
 * Ordena professores por prioridade de atribuição
 * Regra: A > P/N/F > O > V, depois por menor carga alocada
 */
function ordenarProfessoresPorPrioridade(professores: Professor[]): Professor[] {
  return [...professores].sort((a, b) => {
    // Primeiro critério: categoria QM
    const prioridadeA = getPrioridadeCategoria(a.categoria_qm)
    const prioridadeB = getPrioridadeCategoria(b.categoria_qm)
    
    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB
    }
    
    // Segundo critério: menor carga alocada
    return a.aulas_alocadas - b.aulas_alocadas
  })
}

// ==================== VALIDAÇÕES ====================

/**
 * Verifica se professor pode lecionar a disciplina
 */
function professorLecionaDisciplina(professor: Professor, disciplinaId: string): boolean {
  return professor.disciplinas.includes(disciplinaId)
}

/**
 * Verifica se professor está vinculado à escola
 */
function professorVinculadoEscola(professor: Professor, escolaId: string): boolean {
  return professor.escolas.includes(escolaId)
}

/**
 * Verifica se professor está disponível no dia/turno
 */
function professorDisponivelNoHorario(
  professor: Professor,
  dia: DiaSemanaType,
  turno: TurnoTipoType
): boolean {
  const disponibilidade = professor.disponibilidade.find(
    d => d.dia === dia && d.turno === turno
  )
  return disponibilidade?.disponivel ?? true
}

/**
 * Verifica se professor já está alocado no mesmo horário
 */
function professorTemConflitoHorario(
  professor: Professor,
  dia: DiaSemanaType,
  aulaNumero: number,
  alocacoesExistentes: Map<string, Alocacao>,
  slotsMap: Map<string, SlotHorario>
): boolean {
  for (const [slotId, alocacao] of alocacoesExistentes) {
    if (alocacao.professor_id === professor.id) {
      const slot = slotsMap.get(slotId)
      if (slot && slot.dia === dia && slot.aula_numero === aulaNumero) {
        return true // Conflito encontrado
      }
    }
  }
  return false
}

/**
 * Verifica se professor ainda tem carga horária disponível
 */
function professorTemCargaDisponivel(professor: Professor, aulasAdicionais: number = 1): boolean {
  return (professor.aulas_alocadas + aulasAdicionais) <= professor.jornada_aulas
}

/**
 * Categoria V só pode ser usada para aulas eventuais
 */
function validarCategoriaParaTipoAula(
  professor: Professor,
  tipoAula: 'REGULAR' | 'EVENTUAL'
): boolean {
  if (professor.categoria_qm === 'V' && tipoAula === 'REGULAR') {
    return false // Categoria V não pode ter aulas regulares
  }
  return true
}

// ==================== ALGORITMO PRINCIPAL ====================

/**
 * Gera horários automaticamente respeitando todas as regras
 */
export function gerarHorariosAutomaticos(
  slots: SlotHorario[],
  professores: Professor[],
  tipoAula: 'REGULAR' | 'EVENTUAL' = 'REGULAR'
): ResultadoGeracao {
  const resultado: ResultadoGeracao = {
    alocacoes: [],
    conflitos: [],
    estatisticas: {
      total_slots: slots.length,
      alocados: 0,
      conflitos: 0,
      sem_professor: 0,
    },
  }

  // Mapa de slots para consulta rápida
  const slotsMap = new Map(slots.map(s => [s.id, s]))
  
  // Mapa de alocações realizadas
  const alocacoesMap = new Map<string, Alocacao>()
  
  // Cópia dos professores para atualizar carga
  const professoresComCarga = professores.map(p => ({ ...p }))

  // Processar cada slot
  for (const slot of slots) {
    // Filtrar professores candidatos
    const candidatos = professoresComCarga.filter(professor => {
      // 1. Leciona a disciplina?
      if (!professorLecionaDisciplina(professor, slot.disciplina_id)) {
        return false
      }

      // 2. Vinculado à escola?
      if (!professorVinculadoEscola(professor, slot.escola_id)) {
        return false
      }

      // 3. Disponível no horário?
      if (!professorDisponivelNoHorario(professor, slot.dia, slot.turno)) {
        return false
      }

      // 4. Tem carga disponível?
      if (!professorTemCargaDisponivel(professor)) {
        return false
      }

      // 5. Sem conflito de horário?
      if (professorTemConflitoHorario(professor, slot.dia, slot.aula_numero, alocacoesMap, slotsMap)) {
        return false
      }

      // 6. Categoria compatível com tipo de aula?
      if (!validarCategoriaParaTipoAula(professor, tipoAula)) {
        return false
      }

      return true
    })

    // Ordenar por prioridade
    const candidatosOrdenados = ordenarProfessoresPorPrioridade(candidatos)

    if (candidatosOrdenados.length > 0) {
      // Alocar o primeiro candidato (maior prioridade)
      const professorSelecionado = candidatosOrdenados[0]
      
      const alocacao: Alocacao = {
        slot_id: slot.id,
        professor_id: professorSelecionado.id,
        aula_tipo: tipoAula,
      }
      
      resultado.alocacoes.push(alocacao)
      alocacoesMap.set(slot.id, alocacao)
      
      // Atualizar carga do professor
      professorSelecionado.aulas_alocadas++
      resultado.estatisticas.alocados++
    } else {
      // Nenhum professor disponível
      resultado.conflitos.push({
        slot_id: slot.id,
        motivo: 'Nenhum professor disponível para esta disciplina/horário',
      })
      resultado.estatisticas.sem_professor++
    }
  }

  resultado.estatisticas.conflitos = resultado.conflitos.length

  return resultado
}

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Valida se a geração pode prosseguir (pré-condições)
 */
export function validarPreCondicoes(
  slots: SlotHorario[],
  professores: Professor[]
): { valido: boolean; erros: string[] } {
  const erros: string[] = []

  if (slots.length === 0) {
    erros.push('ERRO_SEM_SLOTS: Nenhum slot de horário para processar')
  }

  if (professores.length === 0) {
    erros.push('ERRO_SEM_PROFESSORES: Nenhum professor cadastrado')
  }

  const professoresAtivos = professores.filter(p => 
    p.categoria_qm !== 'V' || p.aulas_alocadas < p.jornada_aulas
  )
  if (professoresAtivos.length === 0) {
    erros.push('ERRO_SEM_PROFESSORES_DISPONIVEIS: Todos os professores estão com carga completa')
  }

  return {
    valido: erros.length === 0,
    erros,
  }
}

/**
 * Calcula estatísticas de alocação por categoria
 */
export function calcularEstatisticasPorCategoria(
  alocacoes: Alocacao[],
  professores: Professor[]
): Record<CategoriaQMType, number> {
  const estatisticas: Record<string, number> = { A: 0, P: 0, N: 0, F: 0, O: 0, V: 0 }
  
  const professoresMap = new Map(professores.map(p => [p.id, p]))
  
  for (const alocacao of alocacoes) {
    const professor = professoresMap.get(alocacao.professor_id)
    if (professor) {
      estatisticas[professor.categoria_qm]++
    }
  }
  
  return estatisticas as Record<CategoriaQMType, number>
}
