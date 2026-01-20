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
import { Plus, Search, Users, AlertCircle } from 'lucide-react'
import { categoriasQM, jornadasCarreira, formatarCPF, limparCPF } from '@/lib/utils'
import { CategoriaQM, Carreira, JornadaAulas } from '@/lib/db/schema'

interface Professor {
  id: string
  nome: string
  cpf: string
  email: string
  telefone?: string
  categoria_qm: typeof CategoriaQM[number]
  carreira: typeof Carreira[number]
  jornada_aulas: number
  formacao?: string
  status: 'ATIVO' | 'INATIVO'
  aulas_alocadas: number
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [filtro, setFiltro] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  
  const [novoProfessor, setNovoProfessor] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    categoria_qm: '' as typeof CategoriaQM[number] | '',
    carreira: '' as typeof Carreira[number] | '',
    jornada_aulas: 0,
    formacao: '',
  })

  const professoresFiltrados = professores.filter((prof) => {
    const matchNome = prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                      prof.cpf.includes(limparCPF(filtro))
    const matchCategoria = filtroCategoria === 'all' || prof.categoria_qm === filtroCategoria
    return matchNome && matchCategoria
  })

  // Jornadas disponíveis baseadas na carreira selecionada
  const jornadasDisponiveis = novoProfessor.carreira
    ? Object.entries(jornadasCarreira[novoProfessor.carreira as keyof typeof jornadasCarreira] || {})
    : []

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!novoProfessor.nome || novoProfessor.nome.length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres'
    }

    const cpfLimpo = limparCPF(novoProfessor.cpf)
    if (cpfLimpo.length !== 11) {
      novosErros.cpf = 'CPF deve ter 11 dígitos'
    }

    if (!novoProfessor.email || !novoProfessor.email.includes('@')) {
      novosErros.email = 'Email inválido'
    }

    if (!novoProfessor.categoria_qm) {
      novosErros.categoria_qm = 'Selecione a categoria QM'
    }

    if (!novoProfessor.carreira) {
      novosErros.carreira = 'Selecione a carreira'
    }

    if (!novoProfessor.jornada_aulas) {
      novosErros.jornada_aulas = 'Selecione a jornada'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleAdicionarProfessor = () => {
    if (!validarFormulario()) return

    const novo: Professor = {
      id: crypto.randomUUID(),
      nome: novoProfessor.nome,
      cpf: limparCPF(novoProfessor.cpf),
      email: novoProfessor.email,
      telefone: novoProfessor.telefone || undefined,
      categoria_qm: novoProfessor.categoria_qm as typeof CategoriaQM[number],
      carreira: novoProfessor.carreira as typeof Carreira[number],
      jornada_aulas: novoProfessor.jornada_aulas,
      formacao: novoProfessor.formacao || undefined,
      status: 'ATIVO',
      aulas_alocadas: 0,
    }

    setProfessores([...professores, novo])
    setNovoProfessor({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      categoria_qm: '',
      carreira: '',
      jornada_aulas: 0,
      formacao: '',
    })
    setErros({})
    setDialogOpen(false)
  }

  const getBadgeVariantCategoria = (categoria: string) => {
    switch (categoria) {
      case 'A': return 'success'
      case 'P':
      case 'N':
      case 'F': return 'default'
      case 'O': return 'warning'
      case 'V': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professores</h2>
          <p className="text-gray-500">Gerencie os professores com suas categorias QM e jornadas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Professor</DialogTitle>
              <DialogDescription>
                Preencha os dados do professor conforme o Quadro de Magistério
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Nome */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo do professor"
                  value={novoProfessor.nome}
                  onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
                />
                {erros.nome && <p className="text-sm text-red-500">{erros.nome}</p>}
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="00000000000"
                  maxLength={14}
                  value={novoProfessor.cpf}
                  onChange={(e) => setNovoProfessor({ ...novoProfessor, cpf: e.target.value })}
                />
                {erros.cpf && <p className="text-sm text-red-500">{erros.cpf}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={novoProfessor.email}
                  onChange={(e) => setNovoProfessor({ ...novoProfessor, email: e.target.value })}
                />
                {erros.email && <p className="text-sm text-red-500">{erros.email}</p>}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={novoProfessor.telefone}
                  onChange={(e) => setNovoProfessor({ ...novoProfessor, telefone: e.target.value })}
                />
              </div>

              {/* Formação */}
              <div className="space-y-2">
                <Label htmlFor="formacao">Formação</Label>
                <Input
                  id="formacao"
                  placeholder="Ex: Licenciatura em Matemática"
                  value={novoProfessor.formacao}
                  onChange={(e) => setNovoProfessor({ ...novoProfessor, formacao: e.target.value })}
                />
              </div>

              {/* Categoria QM */}
              <div className="space-y-2">
                <Label>Categoria QM *</Label>
                <Select
                  value={novoProfessor.categoria_qm}
                  onValueChange={(value) => setNovoProfessor({ ...novoProfessor, categoria_qm: value as typeof CategoriaQM[number] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CategoriaQM.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat} - {categoriasQM[cat].descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {erros.categoria_qm && <p className="text-sm text-red-500">{erros.categoria_qm}</p>}
              </div>

              {/* Carreira */}
              <div className="space-y-2">
                <Label>Carreira *</Label>
                <Select
                  value={novoProfessor.carreira}
                  onValueChange={(value) => setNovoProfessor({ 
                    ...novoProfessor, 
                    carreira: value as typeof Carreira[number],
                    jornada_aulas: 0 // Reset jornada ao mudar carreira
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a carreira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANTERIOR">Carreira Anterior</SelectItem>
                    <SelectItem value="NOVA">Nova Carreira</SelectItem>
                  </SelectContent>
                </Select>
                {erros.carreira && <p className="text-sm text-red-500">{erros.carreira}</p>}
              </div>

              {/* Jornada */}
              <div className="col-span-2 space-y-2">
                <Label>Jornada de Trabalho *</Label>
                <Select
                  value={novoProfessor.jornada_aulas.toString()}
                  onValueChange={(value) => setNovoProfessor({ ...novoProfessor, jornada_aulas: parseInt(value) })}
                  disabled={!novoProfessor.carreira}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={novoProfessor.carreira ? "Selecione a jornada" : "Selecione a carreira primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {jornadasDisponiveis.map(([aulas, nome]) => (
                      <SelectItem key={aulas} value={aulas}>
                        {nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {erros.jornada_aulas && <p className="text-sm text-red-500">{erros.jornada_aulas}</p>}
              </div>
            </div>

            {/* Info sobre categorias */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p className="font-medium text-blue-800 mb-2">Prioridade de Atribuição:</p>
              <p className="text-blue-700">A (1º) → P/N/F (2º) → O (3º) → V (4º - apenas eventuais)</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarProfessor}>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{professores.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {(['A', 'P', 'O', 'V'] as const).map((cat) => (
          <Card key={cat}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">
                {professores.filter(p => cat === 'P' 
                  ? ['P', 'N', 'F'].includes(p.categoria_qm) 
                  : p.categoria_qm === cat
                ).length}
              </p>
              <p className="text-sm text-gray-500">
                {cat === 'P' ? 'P/N/F' : `Cat. ${cat}`}
              </p>
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
                  placeholder="Buscar por nome ou CPF..."
                  className="pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CategoriaQM.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    Categoria {cat}
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
          <CardTitle>Lista de Professores</CardTitle>
          <CardDescription>
            {professoresFiltrados.length} professor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {professores.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum professor cadastrado</p>
              <p className="text-sm">Clique em "Novo Professor" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Carreira</TableHead>
                  <TableHead>Jornada</TableHead>
                  <TableHead>Aulas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professoresFiltrados.map((prof) => (
                  <TableRow key={prof.id}>
                    <TableCell className="font-medium">{prof.nome}</TableCell>
                    <TableCell>{formatarCPF(prof.cpf)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariantCategoria(prof.categoria_qm) as any}>
                        {prof.categoria_qm}
                      </Badge>
                    </TableCell>
                    <TableCell>{prof.carreira}</TableCell>
                    <TableCell>{prof.jornada_aulas} aulas</TableCell>
                    <TableCell>
                      <span className={prof.aulas_alocadas >= prof.jornada_aulas ? 'text-red-600' : ''}>
                        {prof.aulas_alocadas}/{prof.jornada_aulas}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={prof.status === 'ATIVO' ? 'success' : 'destructive'}>
                        {prof.status}
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
