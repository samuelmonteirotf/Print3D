import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validar campos obrigatórios
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 })
    }

    // Modo demonstração
    if (isDemoMode) {
      console.log("[DEMO MODE] POST /api/auth/register - registro não disponível em modo demo")
      return NextResponse.json({
        error: "Modo demonstração: Registro não disponível. Configure DATABASE_URL para habilitar autenticação.",
        demoMode: true
      }, { status: 503 })
    }

    // Verificar se email já existe
    const existingUsers = await sql!`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    // Hash da senha
    const passwordHash = await hashPassword(password)

    // Criar usuário
    const newUsers = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${phone || null}, 'customer')
      RETURNING id, email, first_name, last_name, role
    `

    const newUser = newUsers[0]

    // Gerar token JWT
    const token = await generateToken(newUser.id, newUser.email, newUser.role)

    // Retornar usuário e token
    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
