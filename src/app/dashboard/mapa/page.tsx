'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { School, Download, Printer, Eye } from 'lucide-react'
import { escolas as escolasData } from '@/lib/users-data'

// Cores para as disciplinas (cores vibrantes como na imagem)
const coresDisciplinas: Record<string, string> = {
  'Língua Portuguesa': 'bg-red-500 text-white',
  'Matemática': 'bg-blue-600 text-white',
  'Ciências': 'bg-green-500 text-white',
  'História': 'bg-yellow-400 text-black',
  'Geografia': 'bg-orange-500 text-white',
  'Arte': 'bg-purple-500 text-white',
  'Educação Física': 'bg-cyan-500 text-white',
  'Inglês': 'bg-pink-500 text-white',
  'Filosofia': 'bg-indigo-500 text-white',
  'Sociologia': 'bg-teal-500 text-white',
  'Química': 'bg-lime-500 text-black',
  'Física': 'bg-amber-500 text-black',
  'Biologia': 'bg-emerald-500 text-white',
  'Ed. Física': 'bg-cyan-500 text-white',
  'INTERVALO': 'bg-gray-300 text-gray-600',
  '': 'bg-gray-100 text-gray-400',
}

// Dados de exemplo - Grade de horários no formato da imagem
const gradeExemplo = {
  'MATUTINO': {
    horarios: ['07:00', '07:50', '08:40', '09:30', '10:20', '11:10'],
    termino: '12:00',
    aulas: {
      'SEGUNDA': ['Matemática', 'Matemática', 'Língua Portuguesa', 'INTERVALO', 'História', 'Geografia'],
      'TERCA': ['Língua Portuguesa', 'Ciências', 'Matemática', 'INTERVALO', 'Arte', 'Ed. Física'],
      'QUARTA': ['História', 'Geografia', 'Inglês', 'INTERVALO', 'Matemática', 'Língua Portuguesa'],
      'QUINTA': ['Ciências', 'Ciências', 'Ed. Física', 'INTERVALO', 'Língua Portuguesa', 'Matemática'],
      'SEXTA': ['Inglês', 'Arte', 'História', 'INTERVALO', 'Geografia', 'Ciências'],
    }
  },
  'VESPERTINO': {
    horarios: ['13:00', '13:50', '14:40', '15:30', '16:20', '17:10'],
    termino: '18:00',
    aulas: {
      'SEGUNDA': ['Língua Portuguesa', 'Matemática', 'Ciências', 'INTERVALO', 'História', 'Arte'],
      'TERCA': ['Matemática', 'Língua Portuguesa', 'Ed. Física', 'INTERVALO', 'Geografia', 'Inglês'],
      'QUARTA': ['Ciências', 'História', 'Matemática', 'INTERVALO', 'Língua Portuguesa', 'Ed. Física'],
      'QUINTA': ['Geografia', 'Arte', 'Língua Portuguesa', 'INTERVALO', 'Matemática', 'Ciências'],
      'SEXTA': ['História', 'Inglês', 'Geografia', 'INTERVALO', 'Arte', 'Matemática'],
    }
  },
  'NOTURNO': {
    horarios: ['19:00', '19:45', '20:30', '21:15', '22:00'],
    termino: '22:45',
    aulas: {
      'SEGUNDA': ['Matemática', 'Língua Portuguesa', 'INTERVALO', 'História', 'Filosofia'],
      'TERCA': ['Língua Portuguesa', 'Matemática', 'INTERVALO', 'Sociologia', 'Ciências'],
      'QUARTA': ['Química', 'Física', 'INTERVALO', 'Matemática', 'Língua Portuguesa'],
      'QUINTA': ['Biologia', 'História', 'INTERVALO', 'Geografia', 'Inglês'],
      'SEXTA': ['Filosofia', 'Sociologia', 'INTERVALO', 'Química', 'Física'],
    }
  }
}

const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'] as const
const diasSemanaDisplay: Record<string, string> = {
  'SEGUNDA': 'SEGUNDA',
  'TERCA': 'TERÇA',
  'QUARTA': 'QUARTA',
  'QUINTA': 'QUINTA',
  'SEXTA': 'SEXTA',
}

export default function MapaHorariosPage() {
  const [escolaSelecionada, setEscolaSelecionada] = useState<string>('')
  const [turnoAtivo, setTurnoAtivo] = useState<'MATUTINO' | 'VESPERTINO' | 'NOTURNO'>('MATUTINO')
  const [userRole, setUserRole] = useState<string>('')
  const [userEscolaId, setUserEscolaId] = useState<string>('')

  useEffect(() => {
    // Simular obtenção do usuário logado
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setUserRole(user.role)
      setUserEscolaId(user.escolaId || '')
      if (user.role === 'ESCOLA' && user.escolaId) {
        setEscolaSelecionada(user.escolaId)
      }
    }
  }, [])

  const grade = gradeExemplo[turnoAtivo]

  const getCorDisciplina = (disciplina: string) => {
    return coresDisciplinas[disciplina] || 'bg-gray-200 text-gray-700'
  }

  const escolasDisponiveis = userRole === 'ESCOLA' 
    ? escolasData.filter(e => e.id === userEscolaId)
    : escolasData

  const escolaNome = escolasData.find(e => e.id === escolaSelecionada)?.nome || 'Selecione uma escola'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mapa de Horários</h1>
          <p className="text-gray-500">Visualização da grade horária no formato de quadro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Seleção de Escola */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Escola:</span>
            </div>
            <Select value={escolaSelecionada} onValueChange={setEscolaSelecionada}>
              <SelectTrigger className="w-[350px]">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                {escolasDisponiveis.map((escola) => (
                  <SelectItem key={escola.id} value={escola.id}>
                    {escola.nome} - {escola.cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userRole && (
              <Badge variant={userRole === 'ADMIN' ? 'default' : 'secondary'}>
                {userRole === 'ADMIN' && 'Administrador'}
                {userRole === 'ESCOLA' && 'Diretor'}
                {userRole === 'VISUALIZADOR' && 'Visualizador'}
                {userRole === 'OBSERVADOR' && 'Observador'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quadro de Horários */}
      {escolaSelecionada && (
        <Tabs value={turnoAtivo} onValueChange={(v) => setTurnoAtivo(v as typeof turnoAtivo)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="MATUTINO" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              ☀️ MANHÃ
            </TabsTrigger>
            <TabsTrigger value="VESPERTINO" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              🌅 TARDE
            </TabsTrigger>
            <TabsTrigger value="NOTURNO" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              🌙 NOITE
            </TabsTrigger>
          </TabsList>

          <TabsContent value={turnoAtivo}>
            <Card className="overflow-hidden">
              <CardHeader className={`
                ${turnoAtivo === 'MATUTINO' ? 'bg-yellow-500 text-black' : ''}
                ${turnoAtivo === 'VESPERTINO' ? 'bg-orange-500 text-white' : ''}
                ${turnoAtivo === 'NOTURNO' ? 'bg-indigo-700 text-white' : ''}
              `}>
                <CardTitle className="text-center text-xl">
                  QUADRO DE HORÁRIOS - {turnoAtivo === 'MATUTINO' ? 'MANHÃ' : turnoAtivo === 'VESPERTINO' ? 'TARDE' : 'NOITE'}
                </CardTitle>
                <p className="text-center text-sm opacity-90">{escolaNome}</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-2 border-black bg-gray-100 px-3 py-2 text-sm font-bold w-20">
                          HORÁRIO
                        </th>
                        {diasSemana.map((dia) => (
                          <th 
                            key={dia} 
                            className={`border-2 border-black px-3 py-2 text-sm font-bold text-center
                              ${dia === 'SEGUNDA' ? 'bg-red-600 text-white' : ''}
                              ${dia === 'TERCA' ? 'bg-orange-500 text-white' : ''}
                              ${dia === 'QUARTA' ? 'bg-yellow-400 text-black' : ''}
                              ${dia === 'QUINTA' ? 'bg-green-500 text-white' : ''}
                              ${dia === 'SEXTA' ? 'bg-blue-500 text-white' : ''}
                            `}
                          >
                            {diasSemanaDisplay[dia]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grade.horarios.map((horario, index) => (
                        <tr key={horario}>
                          <td className="border-2 border-black bg-gray-50 px-3 py-3 text-sm font-semibold text-center">
                            {horario}
                          </td>
                          {diasSemana.map((dia) => {
                            const disciplina = grade.aulas[dia][index] || ''
                            const isIntervalo = disciplina === 'INTERVALO'
                            return (
                              <td 
                                key={`${dia}-${index}`} 
                                className={`border-2 border-black px-2 py-3 text-center transition-all
                                  ${getCorDisciplina(disciplina)}
                                  ${isIntervalo ? 'italic' : 'font-medium'}
                                `}
                              >
                                <div className="min-h-[40px] flex items-center justify-center">
                                  {isIntervalo ? (
                                    <span className="text-xs">INTERVALO</span>
                                  ) : (
                                    <span className="text-sm">{disciplina}</span>
                                  )}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td 
                          colSpan={6} 
                          className="border-2 border-black bg-gray-200 px-3 py-2 text-center font-bold"
                        >
                          TÉRMINO - {grade.termino}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Legenda */}
      {escolaSelecionada && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legenda de Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(coresDisciplinas)
                .filter(([key]) => key && key !== 'INTERVALO' && key !== '')
                .map(([disciplina, cor]) => (
                  <Badge key={disciplina} className={`${cor} text-xs`}>
                    {disciplina}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Escolas (para Visualizador e Admin) */}
      {(userRole === 'ADMIN' || userRole === 'VISUALIZADOR' || userRole === 'OBSERVADOR' || !userRole) && !escolaSelecionada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Selecione uma escola para visualizar o quadro de horários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {escolasData.map((escola) => (
                <Button
                  key={escola.id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => setEscolaSelecionada(escola.id)}
                >
                  <School className="h-4 w-4 mr-2 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">{escola.nome}</div>
                    <div className="text-xs text-gray-500">{escola.cidade}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
