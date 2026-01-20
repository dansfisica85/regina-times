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
import { Plus, Search, Building2, MapPin } from 'lucide-react'
import { escolasParticipantes } from '@/lib/utils'

interface Escola {
  id: string
  nome: string
  cidade: string
  tipo: string
  status: 'ATIVO' | 'INATIVO'
}

// Dados iniciais baseados na especificação
const escolasIniciais: Escola[] = Object.entries(escolasParticipantes).flatMap(([cidade, escolas]) =>
  escolas.map((escola, index) => ({
    id: `${cidade}-${index}`,
    nome: escola.nome,
    cidade,
    tipo: escola.tipo,
    status: 'ATIVO' as const,
  }))
)

export default function EscolasPage() {
  const [escolas, setEscolas] = useState<Escola[]>(escolasIniciais)
  const [filtro, setFiltro] = useState('')
  const [filtroCidade, setFiltroCidade] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [novaEscola, setNovaEscola] = useState({
    nome: '',
    cidade: '',
    tipo: 'REGULAR',
  })

  const cidades = Object.keys(escolasParticipantes)

  const escolasFiltradas = escolas.filter((escola) => {
    const matchNome = escola.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchCidade = filtroCidade === 'all' || escola.cidade === filtroCidade
    return matchNome && matchCidade
  })

  const handleAdicionarEscola = () => {
    if (!novaEscola.nome || !novaEscola.cidade) return

    const nova: Escola = {
      id: crypto.randomUUID(),
      nome: novaEscola.nome,
      cidade: novaEscola.cidade,
      tipo: novaEscola.tipo,
      status: 'ATIVO',
    }

    setEscolas([...escolas, nova])
    setNovaEscola({ nome: '', cidade: '', tipo: 'REGULAR' })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Escolas</h2>
          <p className="text-gray-500">Gerencie as 26 escolas participantes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Escola</DialogTitle>
              <DialogDescription>
                Cadastre uma nova escola no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Escola</Label>
                <Input
                  id="nome"
                  placeholder="EE Nome da Escola"
                  value={novaEscola.nome}
                  onChange={(e) => setNovaEscola({ ...novaEscola, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Select
                  value={novaEscola.cidade}
                  onValueChange={(value) => setNovaEscola({ ...novaEscola, cidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade} value={cidade}>
                        {cidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={novaEscola.tipo}
                  onValueChange={(value) => setNovaEscola({ ...novaEscola, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGULAR">Regular</SelectItem>
                    <SelectItem value="PEI">PEI (Programa Ensino Integral)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarEscola}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{escolas.length}</p>
                <p className="text-sm text-gray-500">Total de Escolas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{cidades.length}</p>
                <p className="text-sm text-gray-500">Cidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{escolas.filter(e => e.tipo === 'PEI').length}</p>
            <p className="text-sm text-gray-500">Escolas PEI</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{escolas.filter(e => e.tipo === 'REGULAR').length}</p>
            <p className="text-sm text-gray-500">Escolas Regulares</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar escola..."
                  className="pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <Select value={filtroCidade} onValueChange={setFiltroCidade}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>
                    {cidade}
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
          <CardTitle>Lista de Escolas</CardTitle>
          <CardDescription>
            {escolasFiltradas.length} escola(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escolasFiltradas.map((escola) => (
                <TableRow key={escola.id}>
                  <TableCell className="font-medium">{escola.nome}</TableCell>
                  <TableCell>{escola.cidade}</TableCell>
                  <TableCell>
                    <Badge variant={escola.tipo === 'PEI' ? 'default' : 'secondary'}>
                      {escola.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={escola.status === 'ATIVO' ? 'success' : 'destructive'}>
                      {escola.status}
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
