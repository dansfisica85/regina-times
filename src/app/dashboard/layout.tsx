'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/dashboard/escolas', label: 'Escolas', icon: School },
  { href: '/dashboard/turnos', label: 'Turnos', icon: Clock },
  { href: '/dashboard/professores', label: 'Professores', icon: Users },
  { href: '/dashboard/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { href: '/dashboard/turmas', label: 'Turmas', icon: GraduationCap },
  { href: '/dashboard/grades', label: 'Grade Horária', icon: Calendar },
  { href: '/dashboard/geracao', label: 'Gerar Horários', icon: FileSpreadsheet },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </Link>
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
            <div className="text-sm text-gray-500">
              Ano Letivo 2026
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
