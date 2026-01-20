'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Plus, Trash2, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { turnoNomes, escolasParticipantes } from '@/lib/utils'
import { TurnoTipo } from '@/lib/db/schema'

interface AulaSlot {
  numero: number
  inicio: string
  fim: string
}

interface Turno {
  id: string
  tipo: typeof TurnoTipo[number]
  escola: string
  aulas: AulaSlot[]
  intervaloApos?: number
  intervaloInicio?: string
  intervaloFim?: string
}

const turnosPadrao: Record<typeof TurnoTipo[number], AulaSlot[]> = {
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

export default function TurnosPage() {
  const [escolaSelecionada, setEscolaSelecionada] = useState<string>('')
  const [turnoSelecionado, setTurnoSelecionado] = useState<typeof TurnoTipo[number] | ''>('')
  const [aulas, setAulas] = useState<AulaSlot[]>([])
  const [salvando, setSalvando] = useState(false)

  const listaEscolas = Object.entries(escolasParticipantes).flatMap(([cidade, escolas]) =>
    escolas.map(e => `${e.nome} - ${cidade}`)
  )

  const handleSelecionarTurno = (tipo: typeof TurnoTipo[number]) => {
    setTurnoSelecionado(tipo)
    setAulas(turnosPadrao[tipo].map(a => ({ ...a })))
  }

  const handleAtualizarAula = (index: number, campo: 'inicio' | 'fim', valor: string) => {
    const novasAulas = [...aulas]
    novasAulas[index] = { ...novasAulas[index], [campo]: valor }
    setAulas(novasAulas)
  }

  const handleAdicionarAula = () => {
    const ultimaAula = aulas[aulas.length - 1]
    const novaAula: AulaSlot = {
      numero: aulas.length + 1,
      inicio: ultimaAula?.fim || '08:00',
      fim: '08:50',
    }
    setAulas([...aulas, novaAula])
  }

  const handleRemoverAula = (index: number) => {
    const novasAulas = aulas.filter((_, i) => i !== index).map((a, i) => ({ ...a, numero: i + 1 }))
    setAulas(novasAulas)
  }

  const handleSalvar = async () => {
    if (!escolaSelecionada || !turnoSelecionado) return
    setSalvando(true)
    await new Promise(r => setTimeout(r, 500))
    setSalvando(false)
    alert('Configuração de turno salva com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Turnos</h2>
          <p className="text-gray-500">Configure os horários de aulas por escola e turno</p>
        </div>
      </div>

      {/* Seleção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurar Turno
          </CardTitle>
          <CardDescription>
            Defina os horários de início e fim de cada aula
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Escola</Label>
              <Select value={escolaSelecionada} onValueChange={setEscolaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {listaEscolas.map((escola) => (
                    <SelectItem key={escola} value={escola}>
                      {escola}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Turno</Label>
              <Select 
                value={turnoSelecionado} 
                onValueChange={(v) => handleSelecionarTurno(v as typeof TurnoTipo[number])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {TurnoTipo.map((turno) => (
                    <SelectItem key={turno} value={turno}>
                      {turnoNomes[turno]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor de horários */}
      {turnoSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle>
              Horários - {turnoNomes[turnoSelecionado]}
            </CardTitle>
            <CardDescription>
              Ajuste os horários de cada aula. Padrão: 50 minutos por aula.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {aulas.map((aula, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20 font-medium text-center">
                    {aula.numero}ª Aula
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-500">Início:</Label>
                    <Input
                      type="time"
                      value={aula.inicio}
                      onChange={(e) => handleAtualizarAula(index, 'inicio', e.target.value)}
                      className="w-28"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-500">Fim:</Label>
                    <Input
                      type="time"
                      value={aula.fim}
                      onChange={(e) => handleAtualizarAula(index, 'fim', e.target.value)}
                      className="w-28"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {calcularDuracao(aula.inicio, aula.fim)} min
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoverAula(index)}
                    disabled={aulas.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Intervalo */}
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <Label className="font-medium">Intervalo/Recreio</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-500">Após a</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aulas.map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1}ª
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">aula</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="09:30" className="w-28" />
                  <span>às</span>
                  <Input type="time" defaultValue="09:50" className="w-28" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAdicionarAula}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Aula
              </Button>
              <Button onClick={handleSalvar} disabled={salvando || !escolaSelecionada}>
                <Save className="h-4 w-4 mr-2" />
                {salvando ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo dos turnos configurados */}
      <Card>
        <CardHeader>
          <CardTitle>Turnos Configurados</CardTitle>
          <CardDescription>
            Visão geral das configurações por escola
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {TurnoTipo.map((turno) => (
              <Card key={turno}>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">{turnoNomes[turno]}</h4>
                  <div className="text-sm text-gray-500">
                    <p>{turnosPadrao[turno].length} aulas</p>
                    <p>
                      {turnosPadrao[turno][0]?.inicio} - {turnosPadrao[turno][turnosPadrao[turno].length - 1]?.fim}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calcularDuracao(inicio: string, fim: string): number {
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fim.split(':').map(Number)
  return (h2 * 60 + m2) - (h1 * 60 + m1)
}
