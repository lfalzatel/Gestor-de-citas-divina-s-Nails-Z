import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuarios
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@divinasnails.com' },
    update: {},
    create: {
      email: 'admin@divinasnails.com',
      password: 'admin123', // En producción, esto debería estar hasheado
      name: 'Admin',
      lastName: 'Divina',
      role: 'ADMIN'
    }
  })

  const clientUser = await prisma.user.upsert({
    where: { email: 'maria.gonzalez@email.com' },
    update: {},
    create: {
      email: 'maria.gonzalez@email.com',
      password: 'cliente123', // En producción, esto debería estar hasheado
      name: 'María',
      lastName: 'González',
      role: 'USER'
    }
  })

  // Crear clientes
  const customers = [
    {
      name: 'Claudia',
      lastName: 'López',
      email: 'claled@gmail.com',
      phone: '60228402',
      notes: 'Cliente semanal'
    },
    {
      name: 'Sofía',
      lastName: 'Torres',
      email: 'sofia.torres@email.com',
      phone: '3067890123'
    },
    {
      name: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      phone: '3001234567',
      notes: 'Prefiere citas en la mañana'
    },
    {
      name: 'Isabella',
      lastName: 'Ramírez',
      email: 'isabella.ramirez@email.com',
      phone: '3056789012',
      notes: 'Cliente VIP, siempre puntual'
    },
    {
      name: 'Andrea',
      lastName: 'López',
      email: 'andrea.lopez@email.com',
      phone: '3023456789',
      notes: 'Alérgica a ciertos esmaltes, usar hipoalergénicos'
    },
    {
      name: 'Laura',
      lastName: 'Martínez',
      email: 'laura.martinez@email.com',
      phone: '3009876543',
      notes: 'Cliente frecuente, le gusta el diseño en uñas'
    },
    {
      name: 'Camila',
      lastName: 'García',
      email: 'camila.garcia@email.com',
      phone: '3045678901'
    },
    {
      name: 'Carolina',
      lastName: 'Rodríguez',
      email: 'carolina.rodriguez@email.com',
      phone: '3012345678'
    },
    {
      name: 'Valentina',
      lastName: 'Hernández',
      email: 'valentina.hernandez@email.com',
      phone: '3034567890',
      notes: 'Prefiere tonos nude y naturales'
    }
  ]

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer
    })
  }

  // Crear empleados
  const employees = [
    {
      name: 'Valentina',
      lastName: 'Castro',
      email: 'valentina.designer@divinasnails.com',
      phone: '3112345678',
      address: 'Avenida 40 #15-30, Rionegro',
      birthDate: new Date('1998-11-07'),
      hireDate: new Date('2023-02-09'),
      specialty: 'Arte en Uñas'
    },
    {
      name: 'Camila',
      lastName: 'Vargas',
      email: 'camila.specialist@divinasnails.com',
      phone: '3123456789',
      address: 'Calle 52 #18-45, Rionegro',
      birthDate: new Date('1990-05-29'),
      hireDate: new Date('2020-09-14'),
      specialty: 'Uñas Acrílicas'
    },
    {
      name: 'Daniela',
      lastName: 'Ruiz',
      email: 'daniela.spa.expert@divinasnails.com',
      phone: '3109876543',
      address: 'Carrera 50 #30-25, Rionegro',
      birthDate: new Date('1992-07-21'),
      hireDate: new Date('2021-05-31'),
      specialty: 'Spa de Manos'
    },
    {
      name: 'Sofía',
      lastName: 'Morales',
      email: 'sofia.nail.artist@divinasnails.com',
      phone: '3101234567',
      address: 'Calle 45 #23-10, Rionegro',
      birthDate: new Date('1995-03-14'),
      hireDate: new Date('2022-01-14'),
      specialty: 'Todos'
    }
  ]

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {},
      create: employee
    })
  }

  // Crear servicios
  const services = [
    {
      name: 'Manicura Clásica',
      description: 'Limado, cutícula, hidratación y esmaltado',
      category: 'Manicura',
      duration: 45,
      price: 25000
    },
    {
      name: 'Manicura Spa',
      description: 'Manicura completa con exfoliación y masaje',
      category: 'Manicura',
      duration: 60,
      price: 35000
    },
    {
      name: 'Pedicura Clásica',
      description: 'Limado, cutícula, hidratación y esmaltado de pies',
      category: 'Pedicura',
      duration: 60,
      price: 30000
    },
    {
      name: 'Pedicura Spa',
      description: 'Pedicura completa con exfoliación, masaje y parafina',
      category: 'Pedicura',
      duration: 75,
      price: 45000
    },
    {
      name: 'Uñas Acrílicas Completas',
      description: 'Aplicación completa de uñas acrílicas',
      category: 'Uñas Acrílicas',
      duration: 120,
      price: 80000
    },
    {
      name: 'Relleno Acrílico',
      description: 'Mantenimiento de uñas acrílicas',
      category: 'Uñas Acrílicas',
      duration: 90,
      price: 50000
    },
    {
      name: 'Uñas de Gel Completas',
      description: 'Aplicación completa de uñas de gel',
      category: 'Uñas de Gel',
      duration: 90,
      price: 70000
    },
    {
      name: 'Esmaltado Semipermanente',
      description: 'Esmaltado en gel de larga duración',
      category: 'Uñas de Gel',
      duration: 45,
      price: 35000
    },
    {
      name: 'Diseño en Uñas Básico',
      description: 'Diseño simple con detalles',
      category: 'Arte en Uñas',
      duration: 30,
      price: 15000
    },
    {
      name: 'Diseño en Uñas Premium',
      description: 'Diseño elaborado con técnicas avanzadas',
      category: 'Arte en Uñas',
      duration: 60,
      price: 40000
    },
    {
      name: 'Spa de Manos Completo',
      description: 'Tratamiento completo con exfoliación, mascarilla y parafina',
      category: 'Spa de Manos',
      duration: 45,
      price: 40000
    },
    {
      name: 'Spa de Pies Completo',
      description: 'Tratamiento completo con exfoliación, mascarilla y parafina',
      category: 'Spa de Pies',
      duration: 60,
      price: 45000
    },
    {
      name: 'Retiro de Acrílico/Gel',
      description: 'Retiro seguro de uñas artificiales',
      category: 'Tratamientos',
      duration: 45,
      price: 20000
    },
    {
      name: 'Tratamiento Fortalecedor',
      description: 'Tratamiento para uñas débiles y quebradizas',
      category: 'Tratamientos',
      duration: 30,
      price: 25000
    }
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service
    })
  }

  console.log('Base de datos poblada con datos de ejemplo')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })