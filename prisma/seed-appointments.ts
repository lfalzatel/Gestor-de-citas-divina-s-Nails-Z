import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Obtener clientes, empleados y servicios existentes
  const customers = await prisma.customer.findMany()
  const employees = await prisma.employee.findMany()
  const services = await prisma.service.findMany()

  if (customers.length === 0 || employees.length === 0 || services.length === 0) {
    console.log('Por favor ejecuta primero el seed principal para crear los datos base')
    return
  }

  // Crear citas de ejemplo
  const sampleAppointments = [
    {
      customerId: customers[0]?.id, // Claudia López
      employeeId: employees[1]?.id, // Camila Vargas
      serviceId: services.find(s => s.name === 'Tratamiento Fortalecedor')?.id,
      date: new Date('2025-11-28'),
      startTime: new Date('2025-11-28T10:00:00'),
      endTime: new Date('2025-11-28T10:30:00'),
      status: 'PROGRAMADA',
      totalPrice: 25000
    },
    {
      customerId: customers[2]?.id, // María González
      employeeId: employees[2]?.id, // Daniela Ruiz
      serviceId: services.find(s => s.name === 'Pedicura Clásica')?.id,
      date: new Date('2025-11-29'),
      startTime: new Date('2025-11-29T10:00:00'),
      endTime: new Date('2025-11-29T11:00:00'),
      status: 'PROGRAMADA',
      totalPrice: 30000
    },
    {
      customerId: customers[3]?.id, // Isabella Ramírez
      employeeId: employees[3]?.id, // Sofía Morales
      serviceId: services.find(s => s.name === 'Relleno Acrílico')?.id,
      date: new Date('2025-11-30'),
      startTime: new Date('2025-11-30T10:00:00'),
      endTime: new Date('2025-11-30T11:30:00'),
      status: 'PROGRAMADA',
      totalPrice: 50000
    },
    // Citas pasadas (historial)
    {
      customerId: customers[2]?.id, // María González
      employeeId: employees[1]?.id, // Camila Vargas
      serviceId: services.find(s => s.name === 'Manicura Clásica')?.id,
      date: new Date('2025-11-24'),
      startTime: new Date('2025-11-24T10:00:00'),
      endTime: new Date('2025-11-24T10:45:00'),
      status: 'COMPLETADA',
      totalPrice: 25000
    },
    {
      customerId: customers[6]?.id, // Camila García
      employeeId: employees[3]?.id, // Sofía Morales
      serviceId: services.find(s => s.name === 'Uñas de Gel Completas')?.id,
      date: new Date('2025-11-24'),
      startTime: new Date('2025-11-24T10:00:00'),
      endTime: new Date('2025-11-24T11:30:00'),
      status: 'COMPLETADA',
      totalPrice: 70000
    },
    {
      customerId: customers[1]?.id, // Sofía Torres
      employeeId: employees[0]?.id, // Valentina Castro
      serviceId: services.find(s => s.name === 'Manicura Clásica')?.id,
      date: new Date('2025-11-24'),
      startTime: new Date('2025-11-24T10:00:00'),
      endTime: new Date('2025-11-24T10:45:00'),
      status: 'COMPLETADA',
      totalPrice: 25000
    },
    {
      customerId: customers[3]?.id, // Isabella Ramírez
      employeeId: employees[1]?.id, // Camila Vargas
      serviceId: services.find(s => s.name === 'Manicura Clásica')?.id,
      date: new Date('2025-11-24'),
      startTime: new Date('2025-11-24T10:00:00'),
      endTime: new Date('2025-11-24T10:45:00'),
      status: 'NO_ASISTIO',
      totalPrice: 25000
    },
    {
      customerId: customers[7]?.id, // Carolina Rodríguez
      employeeId: employees[2]?.id, // Daniela Ruiz
      serviceId: services.find(s => s.name === 'Retiro de Acrílico/Gel')?.id,
      date: new Date('2025-11-25'),
      startTime: new Date('2025-11-25T10:00:00'),
      endTime: new Date('2025-11-25T10:45:00'),
      status: 'COMPLETADA',
      totalPrice: 20000
    }
  ]

  for (const appointment of sampleAppointments) {
    if (appointment.customerId && appointment.employeeId && appointment.serviceId) {
      await prisma.appointment.create({
        data: appointment
      })
    }
  }

  console.log('Citas de ejemplo creadas exitosamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })