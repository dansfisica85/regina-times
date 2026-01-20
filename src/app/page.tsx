import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  School, 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileSpreadsheet,
  GraduationCap,
  Building2
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Building2,
      title: '26 Escolas',
      description: 'Gestão centralizada de horários para todas as escolas participantes',
    },
    {
      icon: Users,
      title: 'Professores',
      description: 'Cadastro com categorias QM (A, P, N, F, O, V) e jornadas por carreira',
    },
    {
      icon: BookOpen,
      title: 'Disciplinas',
      description: 'Organização de disciplinas com carga horária semanal',
    },
    {
      icon: GraduationCap,
      title: 'Turmas',
      description: 'Gestão de turmas por escola, série e turno',
    },
    {
      icon: Calendar,
      title: 'Grade Horária',
      description: 'Criação de grades horárias por turma com slots de aula',
    },
    {
      icon: Clock,
      title: 'Geração Automática',
      description: 'Algoritmo de alocação respeitando prioridades e conflitos',
    },
  ]

  const cidades = [
    { nome: 'Barrinha', escolas: 2 },
    { nome: 'Dumont', escolas: 1 },
    { nome: 'Jardinópolis', escolas: 2 },
    { nome: 'Pitangueiras', escolas: 4 },
    { nome: 'Pontal', escolas: 6 },
    { nome: 'Sertãozinho', escolas: 9 },
    { nome: 'Terra Roxa', escolas: 1 },
    { nome: 'Viradouro', escolas: 1 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Regina Times</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Acessar Sistema</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sistema de Geração de Horários Escolares
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plataforma multi-escola para 26 instituições da SEDUC-SP. 
          Geração automática de horários respeitando categorias do Quadro de Magistério e jornadas de trabalho.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Começar Agora
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Ver Demonstração
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Funcionalidades Principais
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Escolas */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Escolas Participantes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {cidades.map((cidade) => (
            <Card key={cidade.nome} className="text-center">
              <CardContent className="pt-6">
                <p className="font-semibold text-gray-900">{cidade.nome}</p>
                <p className="text-sm text-gray-500">{cidade.escolas} escola{cidade.escolas > 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-6">
          Total: <strong>26 escolas</strong> em 8 cidades do interior paulista
        </p>
      </section>

      {/* Categorias QM */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Priorização por Categoria QM
        </h2>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl font-bold text-green-600">1º</span>
                  <div>
                    <p className="font-semibold">Categoria A</p>
                    <p className="text-sm text-gray-600">Docentes efetivos, titulares de cargo</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl font-bold text-blue-600">2º</span>
                  <div>
                    <p className="font-semibold">Categorias P, N, F</p>
                    <p className="text-sm text-gray-600">Estáveis CF/88, Celetistas, Função-atividade</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                  <span className="text-2xl font-bold text-yellow-600">3º</span>
                  <div>
                    <p className="font-semibold">Categoria O</p>
                    <p className="text-sm text-gray-600">Contratados por tempo determinado</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-gray-600">4º</span>
                  <div>
                    <p className="font-semibold">Categoria V</p>
                    <p className="text-sm text-gray-600">Aulas eventuais (substituições)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Regina Times - Sistema de Geração de Horários SEDUC-SP
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Desenvolvido para a rede estadual de educação de São Paulo - 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
