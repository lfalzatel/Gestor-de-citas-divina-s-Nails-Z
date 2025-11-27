'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Users, Scissors, TrendingUp, Bell, Plus, Search, Filter, Edit, Trash2, Eye, UserCheck, UserX, Menu, X, ChevronDown, LogOut, User, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppointmentModal, StatusModal, DeleteModal, CustomerModal } from '@/components/modals'

interface Appointment {
  id: string
  customer: {
    name: string
    lastName: string
  }
  employee: {
    name: string
    lastName: string
  }
  service: {
    name: string
  }
  date: string
  startTime: string
  endTime: string
  status: string
  totalPrice: number
}

const statusColors = {
  PROGRAMADA: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETADA: 'bg-green-100 text-green-800 border-green-200',
  CANCELADA: 'bg-red-100 text-red-800 border-red-200',
  NO_ASISTIO: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "EEEE, d'/'MM'/'yyyy", { locale: es })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, 'HH:mm')
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('citas')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para modales
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  
  // Estados para modales de clientes
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerModalMode, setCustomerModalMode] = useState<'create' | 'edit' | 'view'>('create')

  useEffect(() => {
    if (activeTab === 'citas') {
      fetchAppointments()
    }
  }, [activeTab])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Funciones para manejar acciones
  const handleNewAppointment = () => {
    setModalMode('create')
    setSelectedAppointment(null)
    setShowAppointmentModal(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setModalMode('edit')
    setSelectedAppointment(appointment)
    setShowAppointmentModal(true)
  }

  const handleStatusChange = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowStatusModal(true)
  }

  const handleDeleteAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDeleteModal(true)
  }

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      const url = modalMode === 'create' ? '/api/appointments' : `/api/appointments/${selectedAppointment?.id}`
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        await fetchAppointments() // Refrescar la lista
      }
    } catch (error) {
      console.error('Error saving appointment:', error)
    }
  }

  const handleConfirmStatusChange = async (newStatus: string) => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchAppointments() // Refrescar la lista
      }
    } catch (error) {
      console.error('Error changing status:', error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAppointments() // Refrescar la lista
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
    }
  }

  // Funciones para manejar clientes
  const handleNewCustomer = () => {
    setCustomerModalMode('create')
    setSelectedCustomer(null)
    setShowCustomerModal(true)
  }

  const handleViewCustomer = (customer: any) => {
    setCustomerModalMode('view')
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleEditCustomer = (customer: any) => {
    setCustomerModalMode('edit')
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleDeleteCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowDeleteModal(true)
  }

  const handleSaveCustomer = async (customerData: any) => {
    try {
      const url = customerModalMode === 'create' ? '/api/customers' : `/api/customers/${selectedCustomer?.id}`
      const method = customerModalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (response.ok) {
        // Aquí podríamos refrescar la lista de clientes si fuera necesario
        console.log('Cliente guardado exitosamente')
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const handleConfirmDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Cliente eliminado exitosamente')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  // Separar citas próximas e historial
  const now = new Date()
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) >= now)
  const historyAppointments = appointments.filter(apt => new Date(apt.date) < now)

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Header Global */}
      <header className="bg-[#E8D5C4] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-serif text-[#5D4037]">
                Divina's <span className="text-[#C9A86C]">Nails</span>
              </h1>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('citas')}
                className={`text-[#5D4037] hover:text-[#C9A86C] transition-colors font-medium ${
                  activeTab === 'citas' ? 'border-b-2 border-[#C9A86C]' : ''
                }`}
              >
                Citas
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`text-[#5D4037] hover:text-[#C9A86C] transition-colors font-medium ${
                  activeTab === 'clientes' ? 'border-b-2 border-[#C9A86C]' : ''
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setActiveTab('empleados')}
                className={`text-[#5D4037] hover:text-[#C9A86C] transition-colors font-medium ${
                  activeTab === 'empleados' ? 'border-b-2 border-[#C9A86C]' : ''
                }`}
              >
                Empleados
              </button>
              <button
                onClick={() => setActiveTab('servicios')}
                className={`text-[#5D4037] hover:text-[#C9A86C] transition-colors font-medium ${
                  activeTab === 'servicios' ? 'border-b-2 border-[#C9A86C]' : ''
                }`}
              >
                Servicios
              </button>
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`text-[#5D4037] hover:text-[#C9A86C] transition-colors font-medium ${
                  activeTab === 'estadisticas' ? 'border-b-2 border-[#C9A86C]' : ''
                }`}
              >
                Estadísticas
              </button>
            </nav>

            {/* Acciones Derecha */}
            <div className="flex items-center space-x-4">
              {/* Botón Nueva Cita */}
              <Button 
                onClick={handleNewAppointment}
                className="bg-[#C9A86C] hover:bg-[#B09050] text-white rounded-full p-2 h-10 w-10"
              >
                <Plus className="h-5 w-5" />
              </Button>

              {/* Campana Notificaciones */}
              <Button variant="ghost" size="sm" className="relative text-[#C9A86C] hover:text-[#B09050]">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#C9A86C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {upcomingAppointments.length}
                </span>
              </Button>

              {/* Perfil Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 text-[#5D4037] hover:text-[#C9A86C]"
                >
                  <div className="h-8 w-8 bg-[#C9A86C] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#D7CCC8] py-2">
                    <button className="w-full text-left px-4 py-2 text-[#5D4037] hover:bg-[#E8D5C4] transition-colors">
                      Mi Perfil
                    </button>
                    <button className="w-full text-left px-4 py-2 text-[#5D4037] hover:bg-[#E8D5C4] transition-colors">
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Menú Móvil */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-[#5D4037]"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Navegación Móvil */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-[#D7CCC8]">
              <nav className="flex flex-col space-y-2">
                {['citas', 'clientes', 'empleados', 'servicios', 'estadisticas'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      setShowMobileMenu(false)
                    }}
                    className={`text-left px-4 py-2 text-[#5D4037] hover:bg-[#E8D5C4] rounded-lg transition-colors capitalize ${
                      activeTab === tab ? 'bg-[#E8D5C4] font-medium' : ''
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Módulo de Citas */}
        {activeTab === 'citas' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-serif text-[#5D4037] mb-2">Gestión de Citas</h2>
              <p className="text-[#5D4037]/70">Administra las citas del spa</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A86C] mx-auto"></div>
                <p className="mt-4 text-[#5D4037]/70">Cargando citas...</p>
              </div>
            ) : (
              <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList className="bg-[#E8D5C4] border border-[#D7CCC8]">
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white">
                    Próximas Citas ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white">
                    Historial ({historyAppointments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-[#C9A86C] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#5D4037] mb-2">No hay próximas citas</h3>
                        <p className="text-[#5D4037]/70">Las nuevas citas aparecerán aquí</p>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-[#5D4037]">
                                  {appointment.customer.name} {appointment.customer.lastName}
                                </h3>
                                <Badge className={`${statusColors[appointment.status] || ''} border`}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#5D4037]/80">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Scissors className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{appointment.service.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{appointment.employee.name} {appointment.employee.lastName}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <div className="text-lg font-semibold text-[#C9A86C]">
                                {formatCurrency(appointment.totalPrice)}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                                  onClick={() => handleEditAppointment(appointment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                                  onClick={() => handleStatusChange(appointment)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteAppointment(appointment)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  {historyAppointments.length === 0 ? (
                    <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                      <CardContent className="p-8 text-center">
                        <Clock className="h-12 w-12 text-[#C9A86C] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#5D4037] mb-2">No hay citas en el historial</h3>
                        <p className="text-[#5D4037]/70">Las citas pasadas aparecerán aquí</p>
                      </CardContent>
                    </Card>
                  ) : (
                    historyAppointments.map((appointment) => (
                      <Card key={appointment.id} className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-[#5D4037]">
                                  {appointment.customer.name} {appointment.customer.lastName}
                                </h3>
                                <Badge className={`${statusColors[appointment.status] || ''} border`}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#5D4037]/80">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Scissors className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{appointment.service.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-[#C9A86C]" />
                                  <span>{appointment.employee.name} {appointment.employee.lastName}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <div className="text-lg font-semibold text-[#C9A86C]">
                                {formatCurrency(appointment.totalPrice)}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                                  onClick={() => handleEditAppointment(appointment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                                  onClick={() => handleStatusChange(appointment)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {/* Módulo de Clientes */}
        {activeTab === 'clientes' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#5D4037] mb-2">Gestión de Clientes</h2>
                <p className="text-[#5D4037]/70">Administra la información de los clientes del spa</p>
              </div>
              <Button 
                onClick={handleNewCustomer}
                className="bg-[#C9A86C] hover:bg-[#B09050] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">CL</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">Claudia López</h3>
                      <p className="text-sm text-[#5D4037]/70">claled@gmail.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 60228402</p>
                    <p>📝 Cliente semanal</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                      onClick={() => handleViewCustomer({ name: 'Claudia López', email: 'claled@gmail.com', phone: '60228402', notes: 'Cliente semanal' })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white"
                      onClick={() => handleEditCustomer({ name: 'Claudia López', email: 'claled@gmail.com', phone: '60228402', notes: 'Cliente semanal' })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteCustomer({ name: 'Claudia López', email: 'claled@gmail.com', phone: '60228402', notes: 'Cliente semanal' })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">ST</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">Sofía Torres</h3>
                      <p className="text-sm text-[#5D4037]/70">sofia.torres@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 3067890123</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">MG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">María González</h3>
                      <p className="text-sm text-[#5D4037]/70">maria.gonzalez@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 3001234567</p>
                    <p>📝 Prefiere citas en la mañana</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">IR</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">Isabella Ramírez</h3>
                      <p className="text-sm text-[#5D4037]/70">isabella.ramirez@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 3056789012</p>
                    <p>📝 Cliente VIP, siempre puntual</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">AL</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">Andrea López</h3>
                      <p className="text-sm text-[#5D4037]/70">andrea.lopez@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 3023456789</p>
                    <p>📝 Alérgica a ciertos esmaltes, usar hipoalergénicos</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">LM</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5D4037]">Laura Martínez</h3>
                      <p className="text-sm text-[#5D4037]/70">laura.martinez@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>📞 3009876543</p>
                    <p>📝 Cliente frecuente, le gusta el diseño en uñas</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Módulo de Empleados */}
        {activeTab === 'empleados' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#5D4037] mb-2">Gestión de Empleados</h2>
                <p className="text-[#5D4037]/70">Gestiona al equipo de trabajo del spa</p>
              </div>
                <Button 
                onClick={() => alert('Función de nuevo empleado próximamente')}
                className="bg-[#C9A86C] hover:bg-[#B09050] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center border-2 border-[#C9A86C]">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#5D4037]">Valentina Castro</h3>
                      <p className="text-sm text-[#5D4037]/70">valentina.designer@divinasnails.com</p>
                    </div>
                    <Badge className="bg-[#C9A86C]/20 text-[#C9A86C] border-[#C9A86C]">
                      Activo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>🎨 Arte en Uñas</p>
                    <p>📞 3112345678</p>
                    <p>📅 7/nov/1998 (27 años)</p>
                    <p>📍 Avenida 40 #15-30, Rionegro</p>
                    <p>💼 Desde: 9/feb/2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center border-2 border-[#C9A86C]">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#5D4037]">Camila Vargas</h3>
                      <p className="text-sm text-[#5D4037]/70">camila.specialist@divinasnails.com</p>
                    </div>
                    <Badge className="bg-[#C9A86C]/20 text-[#C9A86C] border-[#C9A86C]">
                      Activo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>💅 Uñas Acrílicas</p>
                    <p>📞 3123456789</p>
                    <p>📅 29/may/1990 (35 años)</p>
                    <p>📍 Calle 52 #18-45, Rionegro</p>
                    <p>💼 Desde: 14/sep/2020</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center border-2 border-[#C9A86C]">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#5D4037]">Daniela Ruiz</h3>
                      <p className="text-sm text-[#5D4037]/70">daniela.spa.expert@divinasnails.com</p>
                    </div>
                    <Badge className="bg-[#C9A86C]/20 text-[#C9A86C] border-[#C9A86C]">
                      Activo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>💆 Spa de Manos</p>
                    <p>📞 3109876543</p>
                    <p>📅 21/jul/1992 (33 años)</p>
                    <p>📍 Carrera 50 #30-25, Rionegro</p>
                    <p>💼 Desde: 31/may/2021</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C] rounded-full flex items-center justify-center border-2 border-[#C9A86C]">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#5D4037]">Sofía Morales</h3>
                      <p className="text-sm text-[#5D4037]/70">sofia.nail.artist@divinasnails.com</p>
                    </div>
                    <Badge className="bg-[#C9A86C]/20 text-[#C9A86C] border-[#C9A86C]">
                      Activo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-[#5D4037]/80 mb-4">
                    <p>✨ Todos</p>
                    <p>📞 3101234567</p>
                    <p>📅 14/mar/1995 (30 años)</p>
                    <p>📍 Calle 45 #23-10, Rionegro</p>
                    <p>💼 Desde: 14/ene/2022</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Módulo de Servicios */}
        {activeTab === 'servicios' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#5D4037] mb-2">Gestión de Servicios</h2>
                <p className="text-[#5D4037]/70">Configura los servicios y precios del spa</p>
              </div>
              <Button 
                onClick={() => alert('Función de nuevo servicio próximamente')}
                className="bg-[#C9A86C] hover:bg-[#B09050] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                Todos
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Manicura
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Pedicura
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Uñas Acrílicas
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Uñas de Gel
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Arte en Uñas
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Spa
              </Button>
              <Button variant="outline" size="sm" className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]">
                Tratamientos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C]/20 rounded-full flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-[#C9A86C]" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Activo
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#5D4037] mb-2">Manicura Clásica</h3>
                  <p className="text-sm text-[#5D4037]/70 mb-4">Limado, cutícula, hidratación y esmaltado</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#5D4037]/60">Manicura</span>
                    <Badge variant="outline" className="border-[#C9A86C] text-[#C9A86C]">
                      45 min
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#C9A86C]">$25.000</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C]/20 rounded-full flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-[#C9A86C]" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Activo
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#5D4037] mb-2">Uñas de Gel Completas</h3>
                  <p className="text-sm text-[#5D4037]/70 mb-4">Aplicación completa de uñas de gel</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#5D4037]/60">Uñas de Gel</span>
                    <Badge variant="outline" className="border-[#C9A86C] text-[#C9A86C]">
                      90 min
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#C9A86C]">$70.000</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#C9A86C]/20 rounded-full flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-[#C9A86C]" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Activo
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#5D4037] mb-2">Relleno Acrílico</h3>
                  <p className="text-sm text-[#5D4037]/70 mb-4">Mantenimiento de uñas acrílicas</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#5D4037]/60">Uñas Acrílicas</span>
                    <Badge variant="outline" className="border-[#C9A86C] text-[#C9A86C]">
                      90 min
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#C9A86C]">$50.000</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Módulo de Estadísticas */}
        {activeTab === 'estadisticas' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-serif text-[#5D4037] mb-2">Estadísticas del Spa</h2>
              <p className="text-[#5D4037]/70">Visualiza métricas y reportes del negocio</p>
            </div>

            <div className="mb-6">
              <select className="px-4 py-2 border border-[#D7CCC8] rounded-lg bg-[#FFFAF5] text-[#5D4037] focus:outline-none focus:border-[#C9A86C]">
                <option>Noviembre 2025</option>
                <option>Octubre 2025</option>
                <option>Septiembre 2025</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Ingresos Totales del Mes</h3>
                  <div className="text-3xl font-bold text-[#C9A86C] mb-4">$235.000</div>
                  <div className="h-32 bg-gradient-to-r from-[#E8D5C4] to-[#C9A86C]/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-[#C9A86C]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Estado de Citas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Completada
                      </span>
                      <span className="font-semibold">6 (42.9%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Programada
                      </span>
                      <span className="font-semibold">4 (28.6%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        No Asistió
                      </span>
                      <span className="font-semibold">2 (14.3%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Cancelada
                      </span>
                      <span className="font-semibold">2 (14.3%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Top Clientes</h3>
                  <Tabs defaultValue="frecuentes" className="space-y-4">
                    <TabsList className="bg-[#E8D5C4] border border-[#D7CCC8]">
                      <TabsTrigger value="frecuentes" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-sm">
                        Más Frecuentes
                      </TabsTrigger>
                      <TabsTrigger value="valiosos" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-sm">
                        Más Valiosos
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="frecuentes" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥇</span>
                          <div className="h-8 w-8 bg-[#C9A86C] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MG</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">María González</div>
                            <div className="text-sm text-[#5D4037]/70">2 citas completadas</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥈</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/80 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CG</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Camila García</div>
                            <div className="text-sm text-[#5D4037]/70">2 citas completadas</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥉</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/60 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ST</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Sofía Torres</div>
                            <div className="text-sm text-[#5D4037]/70">1 cita completada</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="valiosos" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥇</span>
                          <div className="h-8 w-8 bg-[#C9A86C] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MG</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">María González</div>
                            <div className="text-sm text-[#5D4037]/70">$95.000 total</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$95.000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥈</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/80 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CG</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Camila García</div>
                            <div className="text-sm text-[#5D4037]/70">$95.000 total</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$95.000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥉</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/60 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ST</span>
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Sofía Torres</div>
                            <div className="text-sm text-[#5D4037]/70">$25.000 total</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$25.000</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="bg-[#FFFAF5] border-[#D7CCC8]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Top Empleados</h3>
                  <Tabs defaultValue="activos" className="space-y-4">
                    <TabsList className="bg-[#E8D5C4] border border-[#D7CCC8]">
                      <TabsTrigger value="activos" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-sm">
                        Más Activos
                      </TabsTrigger>
                      <TabsTrigger value="rentables" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-sm">
                        Más Rentables
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="activos" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥇</span>
                          <div className="h-8 w-8 bg-[#C9A86C] rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Camila Vargas</div>
                            <div className="text-sm text-[#5D4037]/70">2 citas completadas</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥈</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/80 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Sofía Morales</div>
                            <div className="text-sm text-[#5D4037]/70">2 citas completadas</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥉</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/60 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Valentina Castro</div>
                            <div className="text-sm text-[#5D4037]/70">1 cita completada</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="rentables" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥇</span>
                          <div className="h-8 w-8 bg-[#C9A86C] rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Sofía Morales</div>
                            <div className="text-sm text-[#5D4037]/70">$140.000 generados</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$140.000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥈</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/80 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Camila Vargas</div>
                            <div className="text-sm text-[#5D4037]/70">$50.000 generados</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$50.000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#E8D5C4]/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🥉</span>
                          <div className="h-8 w-8 bg-[#C9A86C]/60 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#5D4037]">Valentina Castro</div>
                            <div className="text-sm text-[#5D4037]/70">$25.000 generados</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#C9A86C]">$25.000</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Placeholder para otras pestañas */}
        {activeTab !== 'citas' && activeTab !== 'clientes' && activeTab !== 'empleados' && activeTab !== 'servicios' && activeTab !== 'estadisticas' && (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'clientes' && <Users className="h-12 w-12 text-[#C9A86C]" />}
              {activeTab === 'empleados' && <UserCheck className="h-12 w-12 text-[#C9A86C]" />}
              {activeTab === 'servicios' && <Scissors className="h-12 w-12 text-[#C9A86C]" />}
              {activeTab === 'estadisticas' && <TrendingUp className="h-12 w-12 text-[#C9A86C]" />}
            </div>
            <h2 className="text-2xl font-serif text-[#5D4037] mb-2 capitalize">
              {activeTab === 'clientes' && 'Gestión de Clientes'}
              {activeTab === 'empleados' && 'Gestión de Empleados'}
              {activeTab === 'servicios' && 'Gestión de Servicios'}
              {activeTab === 'estadisticas' && 'Estadísticas del Spa'}
            </h2>
            <p className="text-[#5D4037]/70 mb-6">
              {activeTab === 'clientes' && 'Administra la información de los clientes del spa'}
              {activeTab === 'empleados' && 'Gestiona al equipo de trabajo del spa'}
              {activeTab === 'servicios' && 'Configura los servicios y precios del spa'}
              {activeTab === 'estadisticas' && 'Visualiza métricas y reportes del negocio'}
            </p>
            <Button className="bg-[#C9A86C] hover:bg-[#B09050] text-white">
              Próximamente
            </Button>
          </div>
        )}
      </main>

      {/* Modales */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        mode={modalMode}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        appointment={selectedAppointment}
        onStatusChange={handleConfirmStatusChange}
      />

      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
        mode={customerModalMode}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={selectedCustomer ? handleConfirmDeleteCustomer : handleConfirmDelete}
        title={selectedCustomer ? "Eliminar Cliente" : "Eliminar Cita"}
        description={selectedCustomer ? 
          `¿Estás seguro de que deseas eliminar a ${selectedCustomer.name}? Esta acción no se puede deshacer.` :
          `¿Estás seguro de que deseas eliminar la cita de ${selectedAppointment?.customer?.name} ${selectedAppointment?.customer?.lastName}? Esta acción no se puede deshacer.`
        }
      />
    </div>
  )
}