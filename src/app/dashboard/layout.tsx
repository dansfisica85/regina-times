'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  School,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  FileSpreadsheet,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  Map,
  Eye,
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface UserData {
  id: string
  email: string
  nome: string
  role: 'ADMIN' | 'ESCOLA' | 'VISUALIZADOR' | 'OBSERVADOR'
  escolaId?: string
}

// Menus por role
const getMenuItems = (role: string) => {
  const baseItems = [
    { href: '/dashboard', label: 'Início', icon: Home, roles: ['ADMIN', 'ESCOLA', 'VISUALIZADOR', 'OBSERVADOR'] },
    { href: '/dashboard/mapa', label: 'Mapa de Horários', icon: Map, roles: ['ADMIN', 'ESCOLA', 'VISUALIZADOR', 'OBSERVADOR'] },
  ]
  
  const adminEscolaItems = [
    { href: '/dashboard/escolas', label: 'Escolas', icon: School, roles: ['ADMIN'] },
    { href: '/dashboard/turnos', label: 'Turnos', icon: Clock, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/professores', label: 'Professores', icon: Users, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/disciplinas', label: 'Disciplinas', icon: BookOpen, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/turmas', label: 'Turmas', icon: GraduationCap, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/grades', label: 'Grade Horária', icon: Calendar, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/geracao', label: 'Gerar Horários', icon: FileSpreadsheet, roles: ['ADMIN', 'ESCOLA'] },
    { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings, roles: ['ADMIN'] },
  ]
  
  return [...baseItems, ...adminEscolaItems].filter(item => item.roles.includes(role))
}

const roleLabels: Record<string, { label: string, color: string }> = {
  'ADMIN': { label: 'Administrador', color: 'bg-red-500' },
  'ESCOLA': { label: 'Diretor de Escola', color: 'bg-blue-500' },
  'VISUALIZADOR': { label: 'Visualizador', color: 'bg-green-500' },
  'OBSERVADOR': { label: 'Observador', color: 'bg-gray-500' },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const menuItems = user ? getMenuItems(user.role) : []
  const roleInfo = user ? roleLabels[user.role] : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <School className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-bold">Regina Times</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-3">
          {user && roleInfo && (
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <Badge className={`${roleInfo.color} text-white text-xs mt-1`}>
                {roleInfo.label}
              </Badge>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Sistema de Horários SEDUC-SP
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <span className="text-sm text-gray-600 hidden md:block">
                  Olá, {user.nome.split(' ')[0]}
                </span>
              )}
              <span className="text-sm text-gray-500">
                Ano Letivo 2026
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
