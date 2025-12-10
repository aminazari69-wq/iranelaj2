import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { fullName, whatsapp, email, password } = await req.json()

    if (!fullName || !whatsapp || !password) {
      return NextResponse.json(
        { error: 'Full name, WhatsApp, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { whatsapp },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this WhatsApp number already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        whatsapp,
        email: email || null,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        whatsapp: user.whatsapp,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
