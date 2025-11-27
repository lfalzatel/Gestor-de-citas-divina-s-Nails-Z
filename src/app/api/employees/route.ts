import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const employees = await db.employee.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, lastName, email, phone, address, birthDate, hireDate, specialty } = body

    const employee = await db.employee.create({
      data: {
        name,
        lastName,
        email,
        phone,
        address,
        birthDate: new Date(birthDate),
        hireDate: new Date(hireDate),
        specialty
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json({ error: 'Error creating employee' }, { status: 500 })
  }
}