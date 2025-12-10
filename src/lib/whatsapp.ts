// WhatsApp Integration for IranElaj
// Supports WhatsApp Cloud API and direct link generation

const ADMIN_WHATSAPP = process.env.WHATSAPP_ADMIN_NUMBER || '+989120995507'

export interface WhatsAppMessage {
  name: string
  whatsapp: string
  specialty: string
  condition: string
  fileLinks?: string[]
  adminLink?: string
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function generateAdminNotificationMessage(data: WhatsAppMessage): string {
  let message = `🏥 *New IranElaj.com Medical Request*\n\n`
  message += `👤 *Name:* ${data.name}\n`
  message += `📱 *WhatsApp:* ${data.whatsapp}\n`
  message += `🏥 *Specialty:* ${data.specialty}\n`
  message += `📋 *Condition:* ${data.condition}\n`
  
  if (data.fileLinks && data.fileLinks.length > 0) {
    message += `
📎 *Files:*
${data.fileLinks.join('
')}
`
  }
  
  if (data.adminLink) {
    message += `\n🔗 *Admin Panel:* ${data.adminLink}`
  }
  
  return message
}

export function getAdminWhatsAppLink(data: WhatsAppMessage): string {
  const message = generateAdminNotificationMessage(data)
  return generateWhatsAppLink(ADMIN_WHATSAPP, message)
}

export function getPatientWhatsAppLink(patientPhone: string, message: string): string {
  return generateWhatsAppLink(patientPhone, message)
}

// For WhatsApp Cloud API (optional - requires API token)
export async function sendWhatsAppCloudAPI(
  to: string,
  message: string
): Promise<boolean> {
  const token = process.env.WHATSAPP_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  
  if (!token || !phoneNumberId || token === 'your-whatsapp-api-token') {
    console.log('WhatsApp Cloud API not configured, using fallback')
    return false
  }
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      }
    )
    
    return response.ok
  } catch (error) {
    console.error('WhatsApp API error:', error)
    return false
  }
}

export async function notifyAdminNewRequest(data: WhatsAppMessage): Promise<{
  success: boolean
  whatsappLink: string
}> {
  const message = generateAdminNotificationMessage(data)
  const whatsappLink = getAdminWhatsAppLink(data)
  
  // Try Cloud API first
  const apiSuccess = await sendWhatsAppCloudAPI(ADMIN_WHATSAPP, message)
  
  return {
    success: apiSuccess,
    whatsappLink: whatsappLink, // Fallback link for manual notification
  }
}
