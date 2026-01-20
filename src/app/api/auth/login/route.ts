import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { createToken, setAuthCookie, verifyPassword } from '@/lib/auth'

// Usuário de demonstração (em produção, buscar do banco)
const demoUser = {
  id: 'demo-user-id',
  email: 'admin@reginatimes.edu.br',
  senha_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY.5up.OG1V.Qv6', // senha: admin123
  nome: 'Administrador',
  role: 'SUPER_ADMIN',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validacao = loginSchema.safeParse(body)
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados de login inválidos', detalhes: validacao.error.flatten() },
        { status: 400 }
      )
    }

    const { email, senha } = validacao.data

    // Modo demonstração: aceitar qualquer login
    // Em produção, buscar usuário do banco e verificar senha
    if (email === 'admin@reginatimes.edu.br' || email.includes('@')) {
      const token = await createToken({
        userId: demoUser.id,
        email: email,
        role: demoUser.role,
        escolaIds: [],
      })

      // Configurar cookie
      await setAuthCookie(token)

      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: email,
          nome: demoUser.nome,
          role: demoUser.role,
        },
      })
    }

    return NextResponse.json(
      { error: 'Email ou senha inválidos' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
