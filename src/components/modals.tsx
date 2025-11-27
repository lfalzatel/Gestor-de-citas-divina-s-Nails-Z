'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Scissors, Users, X, Check, AlertTriangle, Phone, Mail, MapPin, Cake, FileText } from 'lucide-react'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: any
  onSave: (appointment: any) => void
  mode: 'create' | 'edit'
}

export function AppointmentModal({ isOpen, onClose, appointment, onSave, mode }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    serviceId: '',
    date: '',
    startTime: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  // Mock data para selects
  const customers = [
    { id: '1', name: 'Claudia López', email: 'claled@gmail.com', notes: 'Cliente semanal' },
    { id: '2', name: 'Sofía Torres', email: 'sofia.torres@email.com', notes: '' },
    { id: '3', name: 'María González', email: 'maria.gonzalez@email.com', notes: 'Prefiere citas en la mañana' },
    { id: '4', name: 'Isabella Ramírez', email: 'isabella.ramirez@email.com', notes: 'Cliente VIP, siempre puntual' }
  ]

  const employees = [
    { id: '1', name: 'Valentina Castro', specialty: 'Arte en Uñas' },
    { id: '2', name: 'Camila Vargas', specialty: 'Uñas Acrílicas' },
    { id: '3', name: 'Daniela Ruiz', specialty: 'Spa de Manos' },
    { id: '4', name: 'Sofía Morales', specialty: 'Todos' }
  ]

  const services = [
    { id: '1', name: 'Manicura Clásica', duration: 45, price: 25000 },
    { id: '2', name: 'Uñas de Gel Completas', duration: 90, price: 70000 },
    { id: '3', name: 'Relleno Acrílico', duration: 90, price: 50000 },
    { id: '4', name: 'Tratamiento Fortalecedor', duration: 30, price: 25000 }
  ]

  const selectedService = services.find(s => s.id === formData.serviceId)
  const totalPrice = selectedService?.price || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const appointmentData = {
        ...formData,
        endTime: calculateEndTime(formData.startTime, selectedService?.duration || 0),
        totalPrice
      }
      
      await onSave(appointmentData)
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endMinutes = minutes + duration
    const endHours = hours + Math.floor(endMinutes / 60)
    const finalMinutes = endMinutes % 60
    
    return `${String(endHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-[#FFFAF5] border-[#D7CCC8] max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-[#D7CCC8]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-[#5D4037]">
              {mode === 'create' ? 'Nueva Cita' : 'Editar Cita'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer" className="text-[#5D4037] font-medium">Cliente *</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
                  <SelectTrigger className="border-[#D7CCC8] bg-white">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-[#5D4037]/70">{customer.email}</div>
                          {customer.notes && <div className="text-xs text-[#C9A86C]">📝 {customer.notes}</div>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employee" className="text-[#5D4037] font-medium">Empleado *</Label>
                <Select value={formData.employeeId} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger className="border-[#D7CCC8] bg-white">
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="service" className="text-[#5D4037] font-medium">Servicio *</Label>
              <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                <SelectTrigger className="border-[#D7CCC8] bg-white">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.duration}min - ${service.price.toLocaleString('es-CO')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-[#5D4037] font-medium">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="startTime" className="text-[#5D4037] font-medium">Hora Inicio *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                />
              </div>
            </div>

            {selectedService && (
              <div className="bg-[#E8D5C4]/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C9A86C]" />
                  <span className="text-sm text-[#5D4037]">
                    Duración: {selectedService.duration} minutos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C9A86C]" />
                  <span className="text-sm text-[#5D4037]">
                    Hora fin: {formData.startTime ? calculateEndTime(formData.startTime, selectedService.duration) : '--:--'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-[#C9A86C]" />
                  <span className="text-sm font-semibold text-[#C9A86C]">
                    Total: ${totalPrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes" className="text-[#5D4037] font-medium">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="border-[#D7CCC8] bg-white"
                rows={3}
                placeholder="Información adicional sobre la cita..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#C9A86C] hover:bg-[#B09050] text-white flex-1"
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear Cita' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onStatusChange: (status: string) => void
}

export function StatusModal({ isOpen, onClose, appointment, onStatusChange }: StatusModalProps) {
  const statuses = [
    { value: 'PROGRAMADA', label: 'Programada', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar },
    { value: 'COMPLETADA', label: 'Completada', color: 'bg-green-100 text-green-800 border-green-200', icon: Check },
    { value: 'CANCELADA', label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-200', icon: X },
    { value: 'NO_ASISTIO', label: 'No Asistió', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-[#FFFAF5] border-[#D7CCC8]">
        <CardHeader className="border-b border-[#D7CCC8]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-[#5D4037]">
              Cambiar Estado de Cita
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-[#5D4037]/70 mb-2">Cita:</p>
            <p className="font-medium text-[#5D4037]">{appointment?.customer?.name} {appointment?.customer?.lastName}</p>
            <p className="text-sm text-[#5D4037]/70">{appointment?.service?.name}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[#5D4037] font-medium">Seleccionar nuevo estado:</p>
            {statuses.map(status => {
              const Icon = status.icon
              return (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(status.value)
                    onClose()
                  }}
                  className="w-full p-3 rounded-lg border border-[#D7CCC8] hover:bg-[#E8D5C4] transition-colors flex items-center gap-3"
                >
                  <Icon className="h-5 w-5" />
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, description }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-[#FFFAF5] border-[#D7CCC8]">
        <CardHeader className="border-b border-[#D7CCC8]">
          <CardTitle className="text-xl font-serif text-[#5D4037]">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <p className="text-[#5D4037]/70 mb-6">{description}</p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Modales para Clientes
interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: any
  onSave: (customer: any) => void
  mode: 'create' | 'edit' | 'view'
}

export function CustomerModal({ isOpen, onClose, customer, onSave, mode }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const isViewMode = mode === 'view'
  const title = mode === 'create' ? 'Nuevo Cliente' : mode === 'edit' ? 'Editar Cliente' : 'Ver Cliente'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-[#FFFAF5] border-[#D7CCC8] max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-[#D7CCC8]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-[#5D4037]">
              {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-[#5D4037] font-medium">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                  disabled={isViewMode}
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-[#5D4037] font-medium">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-[#5D4037] font-medium">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                  disabled={isViewMode}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-[#5D4037] font-medium">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-[#D7CCC8] bg-white"
                  required
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-[#5D4037] font-medium">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="border-[#D7CCC8] bg-white"
                disabled={isViewMode}
              />
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-[#5D4037] font-medium">Fecha de Nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="border-[#D7CCC8] bg-white"
                disabled={isViewMode}
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-[#5D4037] font-medium">Notas Importantes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="border-[#D7CCC8] bg-white"
                rows={3}
                placeholder="Información importante sobre el cliente..."
                disabled={isViewMode}
              />
            </div>

            {!isViewMode && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#D7CCC8] text-[#5D4037] hover:bg-[#E8D5C4]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C9A86C] hover:bg-[#B09050] text-white flex-1"
                >
                  {loading ? 'Guardando...' : mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}