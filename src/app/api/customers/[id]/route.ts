import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, lastName, email, phone, address, birthDate, notes } = body

    const customer = await db.customer.update({
      where: { id: params.id },
      data: {
        name,
        lastName,
        email,
        phone,
        address: address || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        notes: notes || null
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Error updating customer' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.customer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Error deleting customer' }, { status: 500 })
  }
}