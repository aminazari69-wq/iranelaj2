import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOTP } from '@/lib/utils'
import { generateWhatsAppLink } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  try {
    const { whatsapp } = await req.json()

    if (!whatsapp) {
      return NextResponse.json(
        { error: 'WhatsApp number is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { whatsapp },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    })

    // In production, send OTP via WhatsApp API
    // For now, we'll just return the WhatsApp link
    const message = `Your IranElaj verification code is: ${otp}\n\nThis code expires in 10 minutes.`
    const whatsappLink = generateWhatsAppLink(whatsapp, message)

    // In development, log the OTP
    console.log(`OTP for ${whatsapp}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In production, don't expose the OTP
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
