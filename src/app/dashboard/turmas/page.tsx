'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, GraduationCap } from 'lucide-react'
import { turnoNomes, escolasParticipantes } from '@/lib/utils'
import { TurnoTipo } from '@/lib/db/schema'

interface Turma {
  id: string
  escola: string
  codigo: string
  serie: string
  turno: typeof TurnoTipo[number]
  ano_letivo: number
  sala?: string
  capacidade?: number
  status: 'ATIVO' | 'INATIVO'
}

const series = [
  '1º Ano EF', '2º Ano EF', '3º Ano EF', '4º Ano EF', '5º Ano EF',
  '6º Ano EF', '7º Ano EF', '8º Ano EF', '9º Ano EF',
  '1ª Série EM', '2ª Série EM', '3ª Série EM'
]

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [filtro, setFiltro] = useState('')
  const [filtroEscola, setFiltroEscola] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const [novaTurma, setNovaTurma] = useState({
    escola: '',
    codigo: '',
    serie: '',
    turno: '' as typeof TurnoTipo[number] | '',
    sala: '',
    capacidade: 35,
  })

  // Lista de escolas
  const listaEscolas = Object.entries(escolasParticipantes).flatMap(([cidade, escolas]) =>
    escolas.map(e => `${e.nome} - ${cidade}`)
  )

  const turmasFiltradas = turmas.filter((turma) => {
    const matchTexto = turma.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
                       turma.serie.toLowerCase().includes(filtro.toLowerCase())
    const matchEscola = filtroEscola === 'all' || turma.escola === filtroEscola
    return matchTexto && matchEscola
  })

  const handleAdicionarTurma = () => {
    if (!novaTurma.escola || !novaTurma.codigo || !novaTurma.serie || !novaTurma.turno) return

    const nova: Turma = {
      id: crypto.randomUUID(),
      escola: novaTurma.escola,
      codigo: novaTurma.codigo,
      serie: novaTurma.serie,
      turno: novaTurma.turno as typeof TurnoTipo[number],
      ano_letivo: 2026,
      sala: novaTurma.sala || undefined,
      capacidade: novaTurma.capacidade,
      status: 'ATIVO',
    }

    setTurmas([...turmas, nova])
    setNovaTurma({
      escola: '',
      codigo: '',
      serie: '',
      turno: '',
      sala: '',
      capacidade: 35,
    })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Turmas</h2>
          <p className="text-gray-500">Gerencie as turmas por escola, série e turno</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Turma</DialogTitle>
              <DialogDescription>
                Adicione uma nova turma ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Escola */}
              <div className="space-y-2">
                <Label>Escola *</Label>
                <Select
                  value={novaTurma.escola}
                  onValueChange={(value) => setNovaTurma({ ...novaTurma, escola: value })}
                >
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

              <div className="grid grid-cols-2 gap-4">
                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código da Turma *</Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: 6A, 7B"
                    value={novaTurma.codigo}
                    onChange={(e) => setNovaTurma({ ...novaTurma, codigo: e.target.value.toUpperCase() })}
                  />
                </div>

                {/* Série */}
                <div className="space-y-2">
                  <Label>Série/Ano *</Label>
                  <Select
                    value={novaTurma.serie}
                    onValueChange={(value) => setNovaTurma({ ...novaTurma, serie: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {series.map((serie) => (
                        <SelectItem key={serie} value={serie}>
                          {serie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Turno */}
                <div className="space-y-2">
                  <Label>Turno *</Label>
                  <Select
                    value={novaTurma.turno}
                    onValueChange={(value) => setNovaTurma({ ...novaTurma, turno: value as typeof TurnoTipo[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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

                {/* Sala */}
                <div className="space-y-2">
                  <Label htmlFor="sala">Sala</Label>
                  <Input
                    id="sala"
                    placeholder="Ex: Sala 01"
                    value={novaTurma.sala}
                    onChange={(e) => setNovaTurma({ ...novaTurma, sala: e.target.value })}
                  />
                </div>
              </div>

              {/* Capacidade */}
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade</Label>
                <Input
                  id="capacidade"
                  type="number"
                  min={10}
                  max={60}
                  value={novaTurma.capacidade}
                  onChange={(e) => setNovaTurma({ ...novaTurma, capacidade: parseInt(e.target.value) || 35 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarTurma}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{turmas.length}</p>
                <p className="text-sm text-gray-500">Total de Turmas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {TurnoTipo.map((turno) => (
          <Card key={turno}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{turmas.filter(t => t.turno === turno).length}</p>
              <p className="text-sm text-gray-500">{turnoNomes[turno]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código ou série..."
                  className="pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <Select value={filtroEscola} onValueChange={setFiltroEscola}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filtrar por escola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as escolas</SelectItem>
                {listaEscolas.map((escola) => (
                  <SelectItem key={escola} value={escola}>
                    {escola.split(' - ')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            {turmasFiltradas.length} turma(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {turmas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma turma cadastrada</p>
              <p className="text-sm">Clique em "Nova Turma" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmasFiltradas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell>
                      <Badge variant="outline">{turma.codigo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{turma.serie}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{turma.escola}</TableCell>
                    <TableCell>
                      <Badge variant={
                        turma.turno === 'MATUTINO' ? 'default' :
                        turma.turno === 'VESPERTINO' ? 'secondary' : 'outline'
                      }>
                        {turnoNomes[turma.turno]}
                      </Badge>
                    </TableCell>
                    <TableCell>{turma.sala || '-'}</TableCell>
                    <TableCell>{turma.ano_letivo}</TableCell>
                    <TableCell>
                      <Badge variant={turma.status === 'ATIVO' ? 'success' : 'destructive'}>
                        {turma.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
