import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import ical, { ICalCalendarMethod, ICalEventRepeatingFreq } from 'ical-generator'

interface GradeHorariaExport {
  turma: string
  escola: string
  turno: string
  grade: {
    dia: string
    aula: number
    horario: string
    disciplina: string
    professor: string
  }[]
}

interface ProfessorExport {
  nome: string
  cpf: string
  categoria: string
  carreira: string
  jornada: number
  aulasAlocadas: number
}

// ==================== EXPORTAÇÃO PDF ====================

export function exportarGradeHorariaPDF(dados: GradeHorariaExport) {
  const doc = new jsPDF()
  
  // Cabeçalho
  doc.setFontSize(16)
  doc.text('Grade Horária', 14, 20)
  doc.setFontSize(12)
  doc.text(`Turma: ${dados.turma}`, 14, 30)
  doc.text(`Escola: ${dados.escola}`, 14, 38)
  doc.text(`Turno: ${dados.turno}`, 14, 46)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 54)

  // Tabela
  const tableData = dados.grade.map(item => [
    item.dia,
    `${item.aula}ª aula`,
    item.horario,
    item.disciplina,
    item.professor
  ])

  autoTable(doc, {
    head: [['Dia', 'Aula', 'Horário', 'Disciplina', 'Professor']],
    body: tableData,
    startY: 65,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Regina Times - Sistema de Horários SEDUC-SP | Página ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    )
  }

  return doc.output('blob')
}

export function exportarProfessoresPDF(professores: ProfessorExport[]) {
  const doc = new jsPDF()
  
  doc.setFontSize(16)
  doc.text('Relatório de Professores', 14, 20)
  doc.setFontSize(10)
  doc.text(`Total: ${professores.length} professores`, 14, 30)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 38)

  const tableData = professores.map(p => [
    p.nome,
    p.categoria,
    p.carreira,
    `${p.jornada}h`,
    `${p.aulasAlocadas}/${p.jornada}`
  ])

  autoTable(doc, {
    head: [['Nome', 'Categoria', 'Carreira', 'Jornada', 'Aulas']],
    body: tableData,
    startY: 48,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94] },
  })

  return doc.output('blob')
}

// ==================== EXPORTAÇÃO EXCEL ====================

export function exportarGradeHorariaExcel(dados: GradeHorariaExport) {
  const ws = XLSX.utils.json_to_sheet(dados.grade.map(item => ({
    'Dia': item.dia,
    'Aula': item.aula,
    'Horário': item.horario,
    'Disciplina': item.disciplina,
    'Professor': item.professor,
  })))

  // Adicionar informações de cabeçalho
  XLSX.utils.sheet_add_aoa(ws, [
    ['Grade Horária'],
    [`Turma: ${dados.turma}`],
    [`Escola: ${dados.escola}`],
    [`Turno: ${dados.turno}`],
    [],
  ], { origin: 'A1' })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Grade Horária')

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
}

export function exportarProfessoresExcel(professores: ProfessorExport[]) {
  const ws = XLSX.utils.json_to_sheet(professores.map(p => ({
    'Nome': p.nome,
    'CPF': p.cpf,
    'Categoria QM': p.categoria,
    'Carreira': p.carreira,
    'Jornada (aulas/semana)': p.jornada,
    'Aulas Alocadas': p.aulasAlocadas,
    'Disponibilidade': p.jornada - p.aulasAlocadas,
  })))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Professores')

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
}

// ==================== EXPORTAÇÃO CSV ====================

export function exportarGradeHorariaCSV(dados: GradeHorariaExport): string {
  const headers = 'Dia,Aula,Horário,Disciplina,Professor\n'
  const rows = dados.grade
    .map(item => `${item.dia},${item.aula},${item.horario},"${item.disciplina}","${item.professor}"`)
    .join('\n')
  
  return headers + rows
}

export function exportarProfessoresCSV(professores: ProfessorExport[]): string {
  const headers = 'Nome,CPF,Categoria,Carreira,Jornada,Aulas Alocadas\n'
  const rows = professores
    .map(p => `"${p.nome}",${p.cpf},${p.categoria},${p.carreira},${p.jornada},${p.aulasAlocadas}`)
    .join('\n')
  
  return headers + rows
}

// ==================== EXPORTAÇÃO iCAL ====================

export function exportarHorarioIcal(
  professor: string,
  aulas: Array<{
    disciplina: string
    turma: string
    escola: string
    diaIndex: number // 0 = segunda
    horarioInicio: string
    horarioFim: string
  }>,
  dataInicio: Date = new Date()
) {
  const calendar = ical({ name: `Horário - ${professor}` })
  calendar.method(ICalCalendarMethod.PUBLISH)

  // Encontrar a próxima segunda-feira
  const proximaSegunda = new Date(dataInicio)
  proximaSegunda.setDate(proximaSegunda.getDate() + ((8 - proximaSegunda.getDay()) % 7))

  aulas.forEach(aula => {
    const dataAula = new Date(proximaSegunda)
    dataAula.setDate(dataAula.getDate() + aula.diaIndex)

    const [horaInicio, minInicio] = aula.horarioInicio.split(':').map(Number)
    const [horaFim, minFim] = aula.horarioFim.split(':').map(Number)

    const inicio = new Date(dataAula)
    inicio.setHours(horaInicio, minInicio, 0)

    const fim = new Date(dataAula)
    fim.setHours(horaFim, minFim, 0)

    calendar.createEvent({
      start: inicio,
      end: fim,
      summary: `${aula.disciplina} - ${aula.turma}`,
      description: `Aula de ${aula.disciplina}\nTurma: ${aula.turma}`,
      location: aula.escola,
      repeating: {
        freq: ICalEventRepeatingFreq.WEEKLY,
        until: new Date(dataInicio.getFullYear(), 11, 31), // até fim do ano
      },
    })
  })

  return calendar.toString()
}

// ==================== UTILITÁRIO DE DOWNLOAD ====================

export function downloadBlob(blob: Blob | ArrayBuffer | string, filename: string, type?: string) {
  const actualBlob = blob instanceof Blob 
    ? blob 
    : new Blob([blob], { type: type || 'application/octet-stream' })
  
  const url = URL.createObjectURL(actualBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
