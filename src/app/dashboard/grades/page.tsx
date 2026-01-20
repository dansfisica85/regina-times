'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Save, Trash2, Plus } from 'lucide-react'
import { diasSemana, turnoNomes } from '@/lib/utils'
import { DiaSemana, TurnoTipo } from '@/lib/db/schema'

// Disciplinas de exemplo
const disciplinasExemplo = [
  { id: '1', nome: 'Língua Portuguesa', codigo: 'LP' },
  { id: '2', nome: 'Matemática', codigo: 'MAT' },
  { id: '3', nome: 'Ciências', codigo: 'CIE' },
  { id: '4', nome: 'História', codigo: 'HIS' },
  { id: '5', nome: 'Geografia', codigo: 'GEO' },
  { id: '6', nome: 'Arte', codigo: 'ART' },
  { id: '7', nome: 'Educação Física', codigo: 'EDF' },
  { id: '8', nome: 'Inglês', codigo: 'ING' },
]

// Aulas de exemplo por turno
const aulasPorTurno = {
  MATUTINO: [
    { numero: 1, inicio: '07:00', fim: '07:50' },
    { numero: 2, inicio: '07:50', fim: '08:40' },
    { numero: 3, inicio: '08:40', fim: '09:30' },
    { numero: 4, inicio: '09:50', fim: '10:40' },
    { numero: 5, inicio: '10:40', fim: '11:30' },
    { numero: 6, inicio: '11:30', fim: '12:20' },
  ],
  VESPERTINO: [
    { numero: 1, inicio: '13:00', fim: '13:50' },
    { numero: 2, inicio: '13:50', fim: '14:40' },
    { numero: 3, inicio: '14:40', fim: '15:30' },
    { numero: 4, inicio: '15:50', fim: '16:40' },
    { numero: 5, inicio: '16:40', fim: '17:30' },
    { numero: 6, inicio: '17:30', fim: '18:20' },
  ],
  NOTURNO: [
    { numero: 1, inicio: '19:00', fim: '19:45' },
    { numero: 2, inicio: '19:45', fim: '20:30' },
    { numero: 3, inicio: '20:30', fim: '21:15' },
    { numero: 4, inicio: '21:30', fim: '22:15' },
    { numero: 5, inicio: '22:15', fim: '23:00' },
  ],
}

type GradeSlot = {
  disciplinaId: string | null
  professorId: string | null
}

type GradeData = {
  [dia: string]: {
    [aula: number]: GradeSlot
  }
}

export default function GradesPage() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [turnoAtual, setTurnoAtual] = useState<typeof TurnoTipo[number]>('MATUTINO')
  const [grade, setGrade] = useState<GradeData>({})
  const [salvando, setSalvando] = useState(false)

  const aulas = aulasPorTurno[turnoAtual]

  // Inicializa grade vazia
  const inicializarGrade = () => {
    const novaGrade: GradeData = {}
    DiaSemana.forEach(dia => {
      novaGrade[dia] = {}
      aulas.forEach(aula => {
        novaGrade[dia][aula.numero] = { disciplinaId: null, professorId: null }
      })
    })
    setGrade(novaGrade)
  }

  const handleSelecionarTurma = (turma: string) => {
    setTurmaSelecionada(turma)
    inicializarGrade()
  }

  const handleAtribuirDisciplina = (dia: string, aulaNumero: number, disciplinaId: string | null) => {
    setGrade(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [aulaNumero]: { ...prev[dia]?.[aulaNumero], disciplinaId }
      }
    }))
  }

  const handleSalvarGrade = async () => {
    setSalvando(true)
    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSalvando(false)
    alert('Grade horária salva com sucesso!')
  }

  const contarDisciplinaPorSemana = (disciplinaId: string): number => {
    let count = 0
    Object.values(grade).forEach(dia => {
      Object.values(dia).forEach(slot => {
        if (slot.disciplinaId === disciplinaId) count++
      })
    })
    return count
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade Horária</h2>
          <p className="text-gray-500">Monte a grade de disciplinas por turma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={inicializarGrade}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={handleSalvarGrade} disabled={salvando || !turmaSelecionada}>
            <Save className="h-4 w-4 mr-2" />
            {salvando ? 'Salvando...' : 'Salvar Grade'}
          </Button>
        </div>
      </div>

      {/* Seleção de Turma e Turno */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select value={turmaSelecionada} onValueChange={handleSelecionarTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6A">6º Ano A - EE Luiz Marcari</SelectItem>
                  <SelectItem value="6B">6º Ano B - EE Luiz Marcari</SelectItem>
                  <SelectItem value="7A">7º Ano A - EE Luiz Marcari</SelectItem>
                  <SelectItem value="1EM">1ª Série EM - PEI EE Prof. José Luiz de Siqueira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select 
                value={turnoAtual} 
                onValueChange={(v) => {
                  setTurnoAtual(v as typeof TurnoTipo[number])
                  inicializarGrade()
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TurnoTipo.map(turno => (
                    <SelectItem key={turno} value={turno}>
                      {turnoNomes[turno]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select defaultValue="2026">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Disciplinas */}
      {turmaSelecionada && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição Semanal</CardTitle>
            <CardDescription>Aulas atribuídas por disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {disciplinasExemplo.map(disc => {
                const count = contarDisciplinaPorSemana(disc.id)
                return (
                  <Badge 
                    key={disc.id} 
                    variant={count > 0 ? 'default' : 'outline'}
                    className="text-sm"
                  >
                    {disc.codigo}: {count} aulas
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade */}
      {turmaSelecionada ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Grade da Turma {turmaSelecionada}
            </CardTitle>
            <CardDescription>
              Clique em cada célula para atribuir uma disciplina
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 w-24">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Aula
                    </div>
                  </th>
                  {DiaSemana.slice(0, 5).map(dia => (
                    <th key={dia} className="border p-2 bg-gray-50 min-w-[140px]">
                      {diasSemana[dia]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aulas.map(aula => (
                  <tr key={aula.numero}>
                    <td className="border p-2 bg-gray-50 text-center">
                      <div className="font-medium">{aula.numero}ª</div>
                      <div className="text-xs text-gray-500">
                        {aula.inicio}-{aula.fim}
                      </div>
                    </td>
                    {DiaSemana.slice(0, 5).map(dia => {
                      const slot = grade[dia]?.[aula.numero]
                      const disciplina = slot?.disciplinaId 
                        ? disciplinasExemplo.find(d => d.id === slot.disciplinaId)
                        : null

                      return (
                        <td key={dia} className="border p-1">
                          <Select
                            value={slot?.disciplinaId || 'empty'}
                            onValueChange={(value) => 
                              handleAtribuirDisciplina(dia, aula.numero, value === 'empty' ? null : value)
                            }
                          >
                            <SelectTrigger className={`h-16 ${disciplina ? 'bg-blue-50 border-blue-200' : ''}`}>
                              <SelectValue>
                                {disciplina ? (
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{disciplina.codigo}</div>
                                    <div className="text-xs text-gray-500 truncate">{disciplina.nome}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Vazio</span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="empty">
                                <span className="text-gray-400">Remover</span>
                              </SelectItem>
                              {disciplinasExemplo.map(disc => (
                                <SelectItem key={disc.id} value={disc.id}>
                                  <span className="font-medium">{disc.codigo}</span> - {disc.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione uma turma para montar a grade horária</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
