import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { createToken, setAuthCookie } from '@/lib/auth'
import { findUserByEmail } from '@/lib/users-data'

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

    // Buscar usuário pelo email
    const usuario = findUserByEmail(email)
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar senha
    if (usuario.senha !== senha) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Criar token JWT
    const token = await createToken({
      userId: usuario.id,
      email: usuario.email,
      role: usuario.role,
      escolaIds: usuario.escolaId ? [usuario.escolaId] : [],
    })

    // Configurar cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
        escolaId: usuario.escolaId,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
