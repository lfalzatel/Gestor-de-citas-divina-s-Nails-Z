import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        customer: true,
        employee: true,
        service: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, employeeId, serviceId, date, startTime, notes } = body

    // Obtener el servicio para calcular duración y precio
    const service = await db.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calcular hora de fin
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000)

    const appointment = await db.appointment.create({
      data: {
        customerId,
        employeeId,
        serviceId,
        date: new Date(date),
        startTime: startDateTime,
        endTime: endDateTime,
        notes,
        totalPrice: service.price,
        status: 'PROGRAMADA'
      },
      include: {
        customer: true,
        employee: true,
        service: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 })
  }
}