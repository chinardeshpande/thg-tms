import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Calendar,
  Clock,
  Warehouse,
  Truck,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ScheduleDockModal, DockAppointmentData } from '../components/dock/ScheduleDockModal';

interface DockAppointment {
  id: string;
  dockDoor: string;
  appointmentType: 'inbound' | 'outbound';
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  carrier: string;
  referenceNumber: string;
  vehicleType: string;
  trailerNumber?: string;
  status: 'Scheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  contactName: string;
  contactPhone: string;
  expectedPallets: number;
  specialRequirements?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

const DockScheduling: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'inbound' | 'outbound'>('inbound');
  const [filterType, setFilterType] = useState<'all' | 'inbound' | 'outbound'>('all');

  const [appointments, setAppointments] = useState<DockAppointment[]>([
    {
      id: '1',
      dockDoor: 'DOCK-A1',
      appointmentType: 'inbound',
      appointmentDate: '2025-11-30',
      appointmentTime: '08:00',
      duration: 120,
      carrier: 'FedEx Freight',
      referenceNumber: 'ASN-2024-001',
      vehicleType: '53ft Trailer',
      trailerNumber: 'TRL-12345',
      status: 'In Progress',
      contactName: 'Mike Wilson',
      contactPhone: '+1 (555) 123-4567',
      expectedPallets: 20,
      specialRequirements: 'Live Unload',
      checkInTime: '07:55',
    },
    {
      id: '2',
      dockDoor: 'DOCK-A2',
      appointmentType: 'inbound',
      appointmentDate: '2025-11-30',
      appointmentTime: '10:00',
      duration: 90,
      carrier: 'UPS Freight',
      referenceNumber: 'ASN-2024-002',
      vehicleType: '48ft Trailer',
      status: 'Scheduled',
      contactName: 'Sarah Johnson',
      contactPhone: '+1 (555) 234-5678',
      expectedPallets: 15,
    },
    {
      id: '3',
      dockDoor: 'DOCK-B1',
      appointmentType: 'outbound',
      appointmentDate: '2025-11-30',
      appointmentTime: '14:00',
      duration: 60,
      carrier: 'DHL Freight',
      referenceNumber: 'SO-2024-001',
      vehicleType: 'Box Truck',
      status: 'Scheduled',
      contactName: 'Tom Brown',
      contactPhone: '+1 (555) 345-6789',
      expectedPallets: 8,
    },
    {
      id: '4',
      dockDoor: 'DOCK-B2',
      appointmentType: 'outbound',
      appointmentDate: '2025-11-30',
      appointmentTime: '16:00',
      duration: 120,
      carrier: 'XPO Logistics',
      referenceNumber: 'SO-2024-002',
      vehicleType: '53ft Trailer',
      trailerNumber: 'TRL-67890',
      status: 'Checked In',
      contactName: 'Lisa Davis',
      contactPhone: '+1 (555) 456-7890',
      expectedPallets: 25,
      checkInTime: '15:50',
    },
    {
      id: '5',
      dockDoor: 'DOCK-C1',
      appointmentType: 'inbound',
      appointmentDate: '2025-12-01',
      appointmentTime: '09:00',
      duration: 90,
      carrier: 'Old Dominion',
      referenceNumber: 'ASN-2024-003',
      vehicleType: '53ft Trailer',
      status: 'Scheduled',
      contactName: 'James Miller',
      contactPhone: '+1 (555) 567-8901',
      expectedPallets: 18,
      specialRequirements: 'Temperature Controlled',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'Checked In': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'In Progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
      'No Show': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const dockDoors = [
    { id: 'DOCK-A1', name: 'Dock A1', type: 'inbound' as const },
    { id: 'DOCK-A2', name: 'Dock A2', type: 'inbound' as const },
    { id: 'DOCK-A3', name: 'Dock A3', type: 'inbound' as const },
    { id: 'DOCK-B1', name: 'Dock B1', type: 'outbound' as const },
    { id: 'DOCK-B2', name: 'Dock B2', type: 'outbound' as const },
    { id: 'DOCK-B3', name: 'Dock B3', type: 'outbound' as const },
    { id: 'DOCK-C1', name: 'Dock C1', type: 'both' as const },
    { id: 'DOCK-C2', name: 'Dock C2', type: 'both' as const },
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6); // 6 AM to 6 PM

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.appointmentDate === formatDate(selectedDate);
    const typeMatch = filterType === 'all' || apt.appointmentType === filterType;
    return dateMatch && typeMatch;
  });

  const getAppointmentForSlot = (dockId: string, hour: number) => {
    return filteredAppointments.find(apt => {
      const aptHour = parseInt(apt.appointmentTime.split(':')[0]);
      const aptEndHour = aptHour + (apt.duration / 60);
      return apt.dockDoor === dockId && hour >= aptHour && hour < aptEndHour;
    });
  };

  const handleScheduleAppointment = (data: DockAppointmentData) => {
    const newAppointment: DockAppointment = {
      id: String(appointments.length + 1),
      dockDoor: data.dockDoor,
      appointmentType: data.appointmentType,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      duration: data.duration,
      carrier: data.carrier,
      referenceNumber: data.referenceNumber,
      vehicleType: data.vehicleType,
      trailerNumber: data.trailerNumber,
      status: 'Scheduled',
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      expectedPallets: data.expectedPallets,
      specialRequirements: data.specialRequirements,
    };
    setAppointments([...appointments, newAppointment]);
    alert(`Dock appointment scheduled successfully!\nDock: ${data.dockDoor}\nDate: ${data.appointmentDate} at ${data.appointmentTime}`);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const stats = {
    total: appointments.filter(a => a.appointmentDate === formatDate(selectedDate)).length,
    inbound: appointments.filter(a => a.appointmentDate === formatDate(selectedDate) && a.appointmentType === 'inbound').length,
    outbound: appointments.filter(a => a.appointmentDate === formatDate(selectedDate) && a.appointmentType === 'outbound').length,
    inProgress: appointments.filter(a => a.appointmentDate === formatDate(selectedDate) && a.status === 'In Progress').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Warehouse className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dock Scheduling</h1>
              <p className="text-gray-600 mt-1">Manage dock appointments and door assignments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => { setAppointmentType('inbound'); setShowScheduleModal(true); }}>
              <Plus className="w-5 h-5" />
              Schedule Inbound
            </Button>
            <Button variant="primary" className="gap-2" onClick={() => { setAppointmentType('outbound'); setShowScheduleModal(true); }}>
              <Plus className="w-5 h-5" />
              Schedule Outbound
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Total Appointments</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Inbound</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inbound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Outbound</div>
            <div className="text-2xl font-bold text-green-600">{stats.outbound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Navigation and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 my-auto" />
              {['all', 'inbound', 'outbound'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dock Schedule Grid */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Dock Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header Row */}
              <div className="grid grid-cols-[120px_repeat(13,1fr)] border-b border-gray-200 bg-gray-50">
                <div className="p-3 font-semibold text-sm text-gray-700 border-r border-gray-200">
                  Dock Door
                </div>
                {timeSlots.map(hour => (
                  <div key={hour} className="p-3 text-center text-xs font-medium text-gray-600 border-r border-gray-200">
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Dock Rows */}
              {dockDoors.map(dock => (
                <div key={dock.id} className="grid grid-cols-[120px_repeat(13,1fr)] border-b border-gray-200 hover:bg-gray-50">
                  <div className="p-3 border-r border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">{dock.name}</div>
                    <div className={`text-xs ${
                      dock.type === 'inbound' ? 'text-blue-600' :
                      dock.type === 'outbound' ? 'text-green-600' :
                      'text-purple-600'
                    }`}>
                      {dock.type === 'both' ? 'Multi-Purpose' : dock.type.charAt(0).toUpperCase() + dock.type.slice(1)}
                    </div>
                  </div>
                  {timeSlots.map(hour => {
                    const appointment = getAppointmentForSlot(dock.id, hour);
                    const isStart = appointment && parseInt(appointment.appointmentTime.split(':')[0]) === hour;

                    return (
                      <div
                        key={hour}
                        className={`p-2 border-r border-gray-200 min-h-[80px] ${
                          appointment
                            ? isStart
                              ? 'col-span-' + Math.ceil(appointment.duration / 60)
                              : 'hidden'
                            : ''
                        }`}
                      >
                        {appointment && isStart && (
                          <div className={`h-full rounded p-2 border ${
                            appointment.appointmentType === 'inbound'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-green-50 border-green-200'
                          }`}>
                            <div className="flex items-start justify-between mb-1">
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-900 truncate">{appointment.carrier}</p>
                            <p className="text-xs text-gray-600 truncate">{appointment.referenceNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">{appointment.duration} min</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details List */}
      <Card className="mt-6">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No appointments scheduled for this day</p>
                <p className="text-sm text-gray-500 mt-1">Click the buttons above to schedule a new appointment</p>
              </div>
            ) : (
              filteredAppointments.sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime)).map(apt => (
                <div key={apt.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Warehouse className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">{apt.dockDoor}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {apt.appointmentType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium text-gray-900">{apt.appointmentTime} ({apt.duration} min)</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Carrier</p>
                          <p className="font-medium text-gray-900">{apt.carrier}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Reference</p>
                          <p className="font-medium text-gray-900">{apt.referenceNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Vehicle</p>
                          <p className="font-medium text-gray-900">{apt.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact</p>
                          <p className="font-medium text-gray-900">{apt.contactName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{apt.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expected Pallets</p>
                          <p className="font-medium text-gray-900">{apt.expectedPallets}</p>
                        </div>
                        {apt.specialRequirements && (
                          <div>
                            <p className="text-xs text-gray-500">Special</p>
                            <p className="font-medium text-orange-600">{apt.specialRequirements}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {apt.status === 'Scheduled' && (
                        <Button variant="outline" size="sm">
                          Check In
                        </Button>
                      )}
                      {apt.status === 'Checked In' && (
                        <Button variant="primary" size="sm">
                          Start
                        </Button>
                      )}
                      {apt.status === 'In Progress' && (
                        <Button variant="primary" size="sm">
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      <ScheduleDockModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleAppointment}
        appointmentType={appointmentType}
      />
    </DashboardLayout>
  );
};

export default DockScheduling;
