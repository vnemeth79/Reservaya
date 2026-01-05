import { Resend } from 'resend'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { generateICSFile } from './ics-generator'

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null

const FROM_EMAIL = 'ReservaYa <noreply@reservaya.app>'

export async function sendBookingConfirmation({
  customerEmail,
  customerName,
  booking,
  salon,
  staff,
  service,
}: any) {
  if (!customerEmail || !resend) return

  const icsContent = generateICSFile(booking, salon, staff, service)
  const dateTime = format(
    new Date(booking.bookingDatetime),
    "EEEE, d 'de' MMMM 'a las' HH:mm",
    { locale: es }
  )

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `✅ Confirmación de Cita - ${salon.name}`,
      html: bookingConfirmationTemplate({
        customerName,
        salonName: salon.name,
        salonAddress: salon.address || '',
        salonPhone: salon.phone,
        staffName: staff.name,
        serviceName: service.name,
        duration: service.durationMinutes,
        dateTime,
        modifyLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${salon.slug}/mis-reservas`,
      }),
      attachments: [
        {
          filename: 'cita.ics',
          content: Buffer.from(icsContent).toString('base64'),
        },
      ],
    })
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error)
  }
}

export async function sendBookingReminder({
  customerEmail,
  customerName,
  booking,
  salon,
  staff,
  service,
}: any) {
  if (!customerEmail || !resend) return

  const dateTime = format(
    new Date(booking.bookingDatetime),
    "EEEE, d 'de' MMMM 'a las' HH:mm",
    { locale: es }
  )

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `🔔 Recordatorio: Cita Mañana - ${salon.name}`,
      html: bookingReminderTemplate({
        customerName,
        salonName: salon.name,
        staffName: staff.name,
        serviceName: service.name,
        dateTime,
        salonAddress: salon.address || '',
        salonPhone: salon.phone,
      }),
    })
  } catch (error) {
    console.error('Error al enviar recordatorio:', error)
  }
}

export async function sendStaffNotification({
  staffEmail,
  staffName,
  booking,
  customerName,
  service,
}: any) {
  if (!staffEmail || !resend) return

  const dateTime = format(
    new Date(booking.bookingDatetime),
    "EEEE, d 'de' MMMM 'a las' HH:mm",
    { locale: es }
  )

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: staffEmail,
      subject: '📅 Nueva Cita Agendada',
      html: staffNotificationTemplate({
        staffName,
        customerName,
        serviceName: service.name,
        dateTime,
      }),
    })
  } catch (error) {
    console.error('Error al enviar notificación a staff:', error)
  }
}

export async function sendCancellationEmail({
  customerEmail,
  customerName,
  booking,
  salon,
  staff,
  service,
}: any) {
  if (!customerEmail || !resend) return

  const dateTime = format(
    new Date(booking.bookingDatetime),
    "EEEE, d 'de' MMMM 'a las' HH:mm",
    { locale: es }
  )

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Cita Cancelada - ${salon.name}`,
      html: cancellationTemplate({
        customerName,
        salonName: salon.name,
        dateTime,
        rebookLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${salon.slug}`,
      }),
    })
  } catch (error) {
    console.error('Error al enviar email de cancelación:', error)
  }
}

export async function sendStaffInvitation({
  staffEmail,
  staffName,
  salonName,
  tempPassword,
}: any) {
  if (!staffEmail || !resend) return

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: staffEmail,
      subject: `🎉 Invitación a ReservaYa - ${salonName}`,
      html: staffInvitationTemplate({
        staffName,
        salonName,
        loginUrl,
        email: staffEmail,
        tempPassword,
      }),
    })
  } catch (error) {
    console.error('Error al enviar invitación a staff:', error)
  }
}

// Email Templates

function bookingConfirmationTemplate(data: any) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Cita Confirmada</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hola <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 16px;">Tu cita ha sido confirmada exitosamente.</p>
          
          <div style="background: #fdf2f8; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">📍 Salón:</td>
                <td style="padding: 8px 0;">${data.salonName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">📅 Fecha y Hora:</td>
                <td style="padding: 8px 0;">${data.dateTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">💇 Servicio:</td>
                <td style="padding: 8px 0;">${data.serviceName} (${data.duration} min)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">👤 Profesional:</td>
                <td style="padding: 8px 0;">${data.staffName}</td>
              </tr>
              ${data.salonAddress ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">📍 Dirección:</td>
                <td style="padding: 8px 0;">${data.salonAddress}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">📞 Teléfono:</td>
                <td style="padding: 8px 0;">${data.salonPhone}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            📎 Se ha adjuntado un archivo de calendario (.ics) para que puedas agregar esta cita a tu calendario.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.modifyLink}" style="display: inline-block; background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Modificar o Cancelar Cita
            </a>
          </div>
          
          <p style="font-size: 13px; color: #888; margin-top: 30px;">
            Si necesitas hacer cambios, puedes hacerlo hasta 2 horas antes de tu cita.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f9fafb; color: #666; font-size: 13px;">
          <p style="margin: 0;"><strong>${data.salonName}</strong> • ${data.salonPhone}</p>
          <p style="margin: 10px 0 0 0;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function bookingReminderTemplate(data: any) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔔 Recordatorio de Cita</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hola <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 16px;">Este es un recordatorio de tu cita programada para <strong>mañana</strong>:</p>
          
          <div style="background: #eff6ff; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h2 style="margin: 0 0 15px 0; color: #1e40af;">${data.dateTime}</h2>
            <p style="margin: 5px 0;"><strong>Servicio:</strong> ${data.serviceName}</p>
            <p style="margin: 5px 0;"><strong>Profesional:</strong> ${data.staffName}</p>
            <p style="margin: 5px 0;"><strong>Lugar:</strong> ${data.salonName}</p>
            ${data.salonAddress ? `<p style="margin: 5px 0;"><strong>Dirección:</strong> ${data.salonAddress}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${data.salonPhone}</p>
          </div>
          
          <p style="font-size: 16px; text-align: center; color: #333;">¡Te esperamos! 💇‍♀️</p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f9fafb; color: #666; font-size: 13px;">
          <p style="margin: 0;"><strong>${data.salonName}</strong></p>
          <p style="margin: 10px 0 0 0;">Este es un correo automático.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function staffNotificationTemplate(data: any) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: #10b981; color: white; padding: 25px; text-align: center;">
          <h2 style="margin: 0;">📅 Nueva Cita Agendada</h2>
        </div>
        
        <div style="padding: 25px;">
          <p>Hola <strong>${data.staffName}</strong>,</p>
          <p>Se ha agendado una nueva cita para ti:</p>
          
          <ul style="background: #f0fdf4; padding: 20px 20px 20px 40px; border-radius: 8px; border-left: 4px solid #10b981;">
            <li><strong>Cliente:</strong> ${data.customerName}</li>
            <li><strong>Servicio:</strong> ${data.serviceName}</li>
            <li><strong>Fecha y Hora:</strong> ${data.dateTime}</li>
          </ul>
          
          <p>Revisa tu agenda en la plataforma para más detalles.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function cancellationTemplate(data: any) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: #ef4444; color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Cita Cancelada</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hola <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 16px;">
            Tu cita programada para <strong>${data.dateTime}</strong> en <strong>${data.salonName}</strong> ha sido cancelada.
          </p>
          
          <p style="font-size: 16px;">Si deseas agendar una nueva cita, puedes hacerlo en cualquier momento:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.rebookLink}" style="display: inline-block; background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Agendar Nueva Cita
            </a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f9fafb; color: #666; font-size: 13px;">
          <p style="margin: 0;"><strong>${data.salonName}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function staffInvitationTemplate(data: any) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 ¡Bienvenido a ReservaYa!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hola <strong>${data.staffName}</strong>,</p>
          <p style="font-size: 16px;">
            Has sido agregado como profesional en <strong>${data.salonName}</strong>.
          </p>
          
          <div style="background: #fdf2f8; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <h3 style="margin: 0 0 15px 0; color: #be185d;">Tus credenciales de acceso:</h3>
            <p style="margin: 8px 0;"><strong>URL:</strong> <a href="${data.loginUrl}" style="color: #ec4899;">${data.loginUrl}</a></p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;">
              <strong>Contraseña temporal:</strong> 
              <code style="background: #fff; padding: 4px 10px; border-radius: 4px; font-family: monospace; border: 1px solid #e5e7eb;">${data.tempPassword}</code>
            </p>
          </div>
          
          <p style="color: #dc2626; font-weight: bold; font-size: 14px;">
            ⚠️ Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="display: inline-block; background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

