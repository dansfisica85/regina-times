import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  School, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Dados de demonstração
  const stats = [
    { label: 'Escolas', value: '26', icon: School, href: '/dashboard/escolas', color: 'text-blue-600' },
    { label: 'Professores', value: '0', icon: Users, href: '/dashboard/professores', color: 'text-green-600' },
    { label: 'Disciplinas', value: '0', icon: BookOpen, href: '/dashboard/disciplinas', color: 'text-purple-600' },
    { label: 'Turmas', value: '0', icon: GraduationCap, href: '/dashboard/turmas', color: 'text-orange-600' },
  ]

  const quickActions = [
    { label: 'Cadastrar Professor', href: '/dashboard/professores/novo', icon: Users },
    { label: 'Nova Turma', href: '/dashboard/turmas/nova', icon: GraduationCap },
    { label: 'Criar Grade', href: '/dashboard/grades/nova', icon: Calendar },
    { label: 'Gerar Horários', href: '/dashboard/geracao', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Visão geral do sistema de horários</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Tarefas comuns do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <action.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prioridades de Atribuição */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Prioridade de Atribuição
            </CardTitle>
            <CardDescription>Ordem de prioridade por categoria QM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="font-medium">1º - Categoria A</span>
                <span className="text-sm text-gray-500">Efetivos</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="font-medium">2º - Categorias P/N/F</span>
                <span className="text-sm text-gray-500">Estáveis</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="font-medium">3º - Categoria O</span>
                <span className="text-sm text-gray-500">Contratados</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">4º - Categoria V</span>
                <span className="text-sm text-gray-500">Eventuais</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jornadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Jornadas de Trabalho
            </CardTitle>
            <CardDescription>Aulas semanais por tipo de carreira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Carreira Anterior</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">Reduzida: 9 aulas</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">Inicial: 19 aulas</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">Básica: 24 aulas</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">Integral: 32 aulas</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Nova Carreira</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 rounded text-sm">Completa: 20 aulas</span>
                  <span className="px-2 py-1 bg-blue-100 rounded text-sm">Ampliada: 32 aulas</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Configuração Inicial
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <p>Para começar a usar o sistema, siga estes passos:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Configure as <Link href="/dashboard/escolas" className="underline">escolas</Link> e seus turnos</li>
            <li>Cadastre as <Link href="/dashboard/disciplinas" className="underline">disciplinas</Link> disponíveis</li>
            <li>Adicione os <Link href="/dashboard/professores" className="underline">professores</Link> com suas categorias QM</li>
            <li>Crie as <Link href="/dashboard/turmas" className="underline">turmas</Link> por escola</li>
            <li>Monte as <Link href="/dashboard/grades" className="underline">grades horárias</Link></li>
            <li>Execute a <Link href="/dashboard/geracao" className="underline">geração automática</Link> de horários</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
