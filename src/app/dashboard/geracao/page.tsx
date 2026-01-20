'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Download,
  Zap,
  Clock,
  Users
} from 'lucide-react'
import { categoriasQM, ordenarPorCategoriaQM } from '@/lib/utils'

interface LogGeração {
  timestamp: Date
  tipo: 'info' | 'success' | 'warning' | 'error'
  mensagem: string
}

interface ResultadoAlocacao {
  turma: string
  disciplina: string
  professor: string
  categoria: string
  dia: string
  aula: number
  status: 'alocado' | 'conflito' | 'sem_professor'
}

export default function GeracaoPage() {
  const [escolaSelecionada, setEscolaSelecionada] = useState<string>('')
  const [gerando, setGerando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [logs, setLogs] = useState<LogGeração[]>([])
  const [resultados, setResultados] = useState<ResultadoAlocacao[]>([])
  const [estatisticas, setEstatisticas] = useState({
    totalSlots: 0,
    alocados: 0,
    conflitos: 0,
    semProfessor: 0,
  })

  const adicionarLog = (tipo: LogGeração['tipo'], mensagem: string) => {
    setLogs(prev => [...prev, { timestamp: new Date(), tipo, mensagem }])
  }

  const simularGeracao = async () => {
    setGerando(true)
    setProgresso(0)
    setLogs([])
    setResultados([])

    // Simulação do processo de geração
    adicionarLog('info', 'Iniciando geração de horários...')
    await sleep(500)

    adicionarLog('info', 'Carregando professores ordenados por categoria QM (A > P/N/F > O > V)...')
    setProgresso(10)
    await sleep(400)

    adicionarLog('info', 'Carregando grades horárias das turmas...')
    setProgresso(20)
    await sleep(400)

    adicionarLog('success', '3 turmas encontradas para processamento')
    setProgresso(30)
    await sleep(300)

    // Simular alocações
    const alocacoes: ResultadoAlocacao[] = []
    const turmas = ['6A', '7A', '1EM']
    const disciplinas = ['LP', 'MAT', 'CIE', 'HIS', 'GEO']
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const professores = [
      { nome: 'Maria Silva', categoria: 'A' },
      { nome: 'João Santos', categoria: 'P' },
      { nome: 'Ana Costa', categoria: 'O' },
      { nome: 'Pedro Lima', categoria: 'N' },
    ]

    let processados = 0
    const totalSlots = turmas.length * disciplinas.length * 3

    for (const turma of turmas) {
      adicionarLog('info', `Processando turma ${turma}...`)
      
      for (const disciplina of disciplinas) {
        const professor = professores[Math.floor(Math.random() * professores.length)]
        const status = Math.random() > 0.15 ? 'alocado' : (Math.random() > 0.5 ? 'conflito' : 'sem_professor')
        
        alocacoes.push({
          turma,
          disciplina,
          professor: status === 'sem_professor' ? '-' : professor.nome,
          categoria: status === 'sem_professor' ? '-' : professor.categoria,
          dia: dias[Math.floor(Math.random() * dias.length)],
          aula: Math.floor(Math.random() * 5) + 1,
          status
        })

        if (status === 'alocado') {
          adicionarLog('success', `${turma}: ${disciplina} → ${professor.nome} (Cat. ${professor.categoria})`)
        } else if (status === 'conflito') {
          adicionarLog('warning', `${turma}: ${disciplina} - Conflito de horário detectado`)
        } else {
          adicionarLog('error', `${turma}: ${disciplina} - Nenhum professor disponível`)
        }

        processados++
        setProgresso(30 + Math.round((processados / totalSlots) * 60))
        await sleep(100)
      }
    }

    setResultados(alocacoes)
    setProgresso(95)
    await sleep(300)

    const stats = {
      totalSlots: alocacoes.length,
      alocados: alocacoes.filter(a => a.status === 'alocado').length,
      conflitos: alocacoes.filter(a => a.status === 'conflito').length,
      semProfessor: alocacoes.filter(a => a.status === 'sem_professor').length,
    }
    setEstatisticas(stats)

    adicionarLog('info', `Geração concluída: ${stats.alocados}/${stats.totalSlots} slots preenchidos`)
    setProgresso(100)
    setGerando(false)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const getLogIcon = (tipo: LogGeração['tipo']) => {
    switch (tipo) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geração Automática de Horários</h2>
          <p className="text-gray-500">
            Alocação automática de professores respeitando prioridades do Quadro de Magistério
          </p>
        </div>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Configuração da Geração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Escola</label>
              <Select value={escolaSelecionada} onValueChange={setEscolaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as escolas</SelectItem>
                  <SelectItem value="luiz_marcari">EE Luiz Marcari</SelectItem>
                  <SelectItem value="jose_luiz">PEI EE Prof. José Luiz de Siqueira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os turnos</SelectItem>
                  <SelectItem value="matutino">Matutino</SelectItem>
                  <SelectItem value="vespertino">Vespertino</SelectItem>
                  <SelectItem value="noturno">Noturno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo</label>
              <Select defaultValue="completo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completo">Geração completa</SelectItem>
                  <SelectItem value="incremental">Apenas slots vazios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Regras de Prioridade */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Ordem de Priorização</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500">1º Cat. A (Efetivos)</Badge>
              <Badge className="bg-blue-500">2º Cat. P/N/F (Estáveis)</Badge>
              <Badge className="bg-yellow-500 text-black">3º Cat. O (Contratados)</Badge>
              <Badge variant="secondary">4º Cat. V (Eventuais)</Badge>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Professores categoria V são usados apenas para aulas eventuais (substituições)
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <Button 
              onClick={simularGeracao} 
              disabled={gerando}
              className="gap-2"
            >
              {gerando ? (
                <>
                  <Pause className="h-4 w-4" />
                  Gerando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar Geração
                </>
              )}
            </Button>
            {resultados.length > 0 && (
              <>
                <Button variant="outline" onClick={() => setResultados([])}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Resultado
                </Button>
              </>
            )}
          </div>

          {/* Barra de progresso */}
          {(gerando || progresso > 0) && (
            <div className="space-y-2">
              <Progress value={progresso} className="h-2" />
              <p className="text-sm text-gray-500 text-center">{progresso}% concluído</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {estatisticas.totalSlots > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Slots</p>
                  <p className="text-2xl font-bold">{estatisticas.totalSlots}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Alocados</p>
                  <p className="text-2xl font-bold text-green-700">{estatisticas.alocados}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Conflitos</p>
                  <p className="text-2xl font-bold text-yellow-700">{estatisticas.conflitos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Sem Professor</p>
                  <p className="text-2xl font-bold text-red-700">{estatisticas.semProfessor}</p>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Log de execução */}
        <Card>
          <CardHeader>
            <CardTitle>Log de Execução</CardTitle>
            <CardDescription>Acompanhe o processo em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto space-y-1 font-mono text-sm bg-gray-50 rounded-lg p-3">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Clique em "Iniciar Geração" para começar
                </p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {getLogIcon(log.tipo)}
                    <span className="text-gray-500 text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={
                      log.tipo === 'error' ? 'text-red-600' :
                      log.tipo === 'warning' ? 'text-yellow-600' :
                      log.tipo === 'success' ? 'text-green-600' : 'text-gray-700'
                    }>
                      {log.mensagem}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Alocações Realizadas</CardTitle>
            <CardDescription>Últimas atribuições do processo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto">
              {resultados.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Nenhum resultado ainda
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turma</TableHead>
                      <TableHead>Disc.</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Cat.</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.slice(-15).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.turma}</TableCell>
                        <TableCell>{r.disciplina}</TableCell>
                        <TableCell className="max-w-[100px] truncate">{r.professor}</TableCell>
                        <TableCell>
                          {r.categoria !== '-' && (
                            <Badge variant={
                              r.categoria === 'A' ? 'success' :
                              ['P', 'N', 'F'].includes(r.categoria) ? 'default' :
                              r.categoria === 'O' ? 'warning' : 'secondary'
                            } className="text-xs">
                              {r.categoria}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            r.status === 'alocado' ? 'success' :
                            r.status === 'conflito' ? 'warning' : 'destructive'
                          } className="text-xs">
                            {r.status === 'alocado' ? 'OK' :
                             r.status === 'conflito' ? 'Conflito' : 'Vazio'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
