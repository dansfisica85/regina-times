'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, BookOpen } from 'lucide-react'

interface Disciplina {
  id: string
  nome: string
  codigo: string
  carga_semanal_padrao: number
  series: string
  status: 'ATIVO' | 'INATIVO'
}

// Disciplinas comuns da SEDUC-SP
const disciplinasIniciais: Disciplina[] = [
  { id: '1', nome: 'Língua Portuguesa', codigo: 'LP', carga_semanal_padrao: 5, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '2', nome: 'Matemática', codigo: 'MAT', carga_semanal_padrao: 5, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '3', nome: 'Ciências', codigo: 'CIE', carga_semanal_padrao: 3, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '4', nome: 'História', codigo: 'HIS', carga_semanal_padrao: 3, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '5', nome: 'Geografia', codigo: 'GEO', carga_semanal_padrao: 3, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '6', nome: 'Arte', codigo: 'ART', carga_semanal_padrao: 2, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '7', nome: 'Educação Física', codigo: 'EDF', carga_semanal_padrao: 2, series: '1º ao 9º ano', status: 'ATIVO' },
  { id: '8', nome: 'Inglês', codigo: 'ING', carga_semanal_padrao: 2, series: '6º ao 9º ano', status: 'ATIVO' },
  { id: '9', nome: 'Física', codigo: 'FIS', carga_semanal_padrao: 2, series: 'Ensino Médio', status: 'ATIVO' },
  { id: '10', nome: 'Química', codigo: 'QUI', carga_semanal_padrao: 2, series: 'Ensino Médio', status: 'ATIVO' },
  { id: '11', nome: 'Biologia', codigo: 'BIO', carga_semanal_padrao: 2, series: 'Ensino Médio', status: 'ATIVO' },
  { id: '12', nome: 'Filosofia', codigo: 'FIL', carga_semanal_padrao: 1, series: 'Ensino Médio', status: 'ATIVO' },
  { id: '13', nome: 'Sociologia', codigo: 'SOC', carga_semanal_padrao: 1, series: 'Ensino Médio', status: 'ATIVO' },
]

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais)
  const [filtro, setFiltro] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const [novaDisciplina, setNovaDisciplina] = useState({
    nome: '',
    codigo: '',
    carga_semanal_padrao: 4,
    series: '',
  })

  const disciplinasFiltradas = disciplinas.filter((disc) => 
    disc.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    disc.codigo.toLowerCase().includes(filtro.toLowerCase())
  )

  const handleAdicionarDisciplina = () => {
    if (!novaDisciplina.nome || !novaDisciplina.codigo) return

    const nova: Disciplina = {
      id: crypto.randomUUID(),
      nome: novaDisciplina.nome,
      codigo: novaDisciplina.codigo.toUpperCase(),
      carga_semanal_padrao: novaDisciplina.carga_semanal_padrao,
      series: novaDisciplina.series || 'Todas',
      status: 'ATIVO',
    }

    setDisciplinas([...disciplinas, nova])
    setNovaDisciplina({ nome: '', codigo: '', carga_semanal_padrao: 4, series: '' })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Disciplinas</h2>
          <p className="text-gray-500">Gerencie as disciplinas disponíveis</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Disciplina</DialogTitle>
              <DialogDescription>
                Adicione uma nova disciplina ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Disciplina</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Língua Portuguesa"
                  value={novaDisciplina.nome}
                  onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: LP"
                    maxLength={5}
                    value={novaDisciplina.codigo}
                    onChange={(e) => setNovaDisciplina({ ...novaDisciplina, codigo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carga">Carga Semanal Padrão</Label>
                  <Input
                    id="carga"
                    type="number"
                    min={1}
                    max={10}
                    value={novaDisciplina.carga_semanal_padrao}
                    onChange={(e) => setNovaDisciplina({ ...novaDisciplina, carga_semanal_padrao: parseInt(e.target.value) || 4 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="series">Séries/Anos Aplicáveis</Label>
                <Input
                  id="series"
                  placeholder="Ex: 6º ao 9º ano"
                  value={novaDisciplina.series}
                  onChange={(e) => setNovaDisciplina({ ...novaDisciplina, series: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarDisciplina}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{disciplinas.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{disciplinas.filter(d => d.series.includes('Médio')).length}</p>
            <p className="text-sm text-gray-500">Ensino Médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{disciplinas.filter(d => !d.series.includes('Médio')).length}</p>
            <p className="text-sm text-gray-500">Fund. I e II</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{disciplinas.filter(d => d.status === 'ATIVO').length}</p>
            <p className="text-sm text-gray-500">Ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar disciplina por nome ou código..."
              className="pl-10"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disciplinas</CardTitle>
          <CardDescription>
            {disciplinasFiltradas.length} disciplina(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Carga Semanal</TableHead>
                <TableHead>Séries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disciplinasFiltradas.map((disc) => (
                <TableRow key={disc.id}>
                  <TableCell>
                    <Badge variant="outline">{disc.codigo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{disc.nome}</TableCell>
                  <TableCell>{disc.carga_semanal_padrao} aulas</TableCell>
                  <TableCell className="text-sm text-gray-500">{disc.series}</TableCell>
                  <TableCell>
                    <Badge variant={disc.status === 'ATIVO' ? 'success' : 'destructive'}>
                      {disc.status}
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
        </CardContent>
      </Card>
    </div>
  )
}
