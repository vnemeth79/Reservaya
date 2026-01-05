import { format } from 'date-fns'

export function generateICSFile(booking: any, salon: any, staff: any, service: any) {
  const startDate = new Date(booking.bookingDatetime)
  const endDate = new Date(startDate.getTime() + service.durationMinutes * 60000)

  const formatICSDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss")
  }

  const escapeText = (text: string) => {
    return text.replace(/[\\,;]/g, (match) => '\\' + match).replace(/\n/g, '\\n')
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ReservaYa//ES
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.id}@reservaya.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${escapeText(service.name)} - ${escapeText(salon.name)}
DESCRIPTION:${escapeText(`Cita con ${staff.name} en ${salon.name}\nServicio: ${service.name}\nDuración: ${service.durationMinutes} minutos`)}
LOCATION:${escapeText(salon.address || salon.name)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
DESCRIPTION:Recordatorio: Cita mañana en ${escapeText(salon.name)}
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Recordatorio: Cita en 2 horas en ${escapeText(salon.name)}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`
}

